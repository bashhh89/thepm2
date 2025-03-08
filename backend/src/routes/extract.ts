import express from 'express';
import multer from 'multer';
import * as mammoth from 'mammoth';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfjs from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const router = express.Router();

// Enable CORS with more permissive settings
router.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure multer for temporary file storage
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

interface ParsedResume {
  text: string;
  metadata: {
    sections: {
      type: 'contact' | 'education' | 'experience' | 'skills' | 'summary' | 'other';
      content: string;
      confidence: number;
    }[];
    detected_name?: string;
    detected_email?: string;
    detected_phone?: string;
    detected_links?: string[];
  };
}

import type { TextItem as PdfjsTextItem } from "pdfjs-dist/types/src/display/api";
import type { TextItem, TextItems } from "lib/parse-resume-from-pdf/types";

/**
 * Step 1: Read pdf and output textItems by concatenating results from each page.
 */
const readPdf = async (buffer: Buffer): Promise<TextItems> => {
  // pdfjs setup
  pdfjs.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../node_modules/pdfjs-dist/build/pdf.worker.js');

  const pdfFile = await pdfjs.getDocument({ data: buffer }).promise;
  let textItems: TextItems = [];

  for (let i = 1; i <= pdfFile.numPages; i++) {
    // Parse each page into text content
    const page = await pdfFile.getPage(i);
    const textContent = await page.getTextContent();

    // Wait for font data to be loaded
    await page.getOperatorList();
    const commonObjs = page.commonObjs;

    // Convert Pdfjs TextItem type to new TextItem type
    const pageTextItems = textContent.items.map((item) => {
      const {
        str: text,
        dir, // Remove text direction
        transform,
        fontName: pdfFontName,
        ...otherProps
      } = item as PdfjsTextItem;

      // Extract x, y position of text item from transform.
      // As a side note, origin (0, 0) is bottom left.
      // Reference: https://github.com/mozilla/pdf.js/issues/5643#issuecomment-496648719
      const x = transform[4];
      const y = transform[5];

      // Use commonObjs to convert font name to original name (e.g. "GVDLYI+Arial-BoldMT")
      // since non system font name by default is a loaded name, e.g. "g_d8_f1"
      // Reference: https://github.com/mozilla/pdf.js/pull/15659
      const fontObj = commonObjs.get(pdfFontName);
      const fontName = fontObj.name;

      // pdfjs reads a "-" as "-­‐" in the resume example. This is to revert it.
      // Note "-­‐" is "-&#x00AD;‐" with a soft hyphen in between. It is not the same as "--"
      const newText = text.replace(/-­‐/g, "-");

      const newItem = {
        ...otherProps,
        fontName,
        text: newText,
        x,
        y,
      };
      return newItem;
    });

    // Some pdf's text items are not in order. This is most likely a result of creating it
    // from design softwares, e.g. canvas. The commented out method can sort pageTextItems
    // by y position to put them back in order. But it is not used since it might be more
    // helpful to let users know that the pdf is not in order.
    // pageTextItems.sort((a, b) => Math.round(b.y) - Math.round(a.y));

    // Add text items of each page to total
    textItems.push(...pageTextItems);
  }

  // Filter out empty space textItem noise
  const isEmptySpace = (textItem: TextItem) =>
    !textItem.hasEOL && textItem.text.trim() === "";
  textItems = textItems.filter((textItem) => !isEmptySpace(textItem));

  return textItems;
};

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "No text content found in document";
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

function parseResumeContent(text: string): ParsedResume['metadata'] {
  const sections: ParsedResume['metadata']['sections'] = [];
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  let currentSection = {
    type: 'other' as "contact" | "education" | "experience" | "skills" | 'summary' | 'other',
    content: '',
    confidence: 0
  };
  
  // Common section headers
  const sectionHeaders = {
    summary: /^(?:summary|profile|objective|about)/i,
    education: /^education|academic|qualification/i,
    experience: /^(?:experience|employment|work history|professional background)/i,
    skills: /^(?:skills|technical skills|competencies|expertise)/i,
    contact: /^(?:contact|personal information|details)/i
  };

  // Contact information patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phonePattern = /(?:\+?\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
  const linkPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)*/g;

  const metadata: ParsedResume['metadata'] = {
    sections: [],
    detected_links: []
  };

  // Extract contact information
  for (const line of lines) {
    const email = line.match(emailPattern)?.[0];
    const phone = line.match(phonePattern)?.[0];
    const links = [...line.matchAll(linkPattern)].map(match => match[0]);
    
    if (email && !metadata.detected_email) metadata.detected_email = email;
    if (phone && !metadata.detected_phone) metadata.detected_phone = phone;
    if (links.length) metadata.detected_links?.push(...links);
  }

  // Detect sections and their content
  for (const line of lines) {
    let sectionDetected = false;
    
    for (const [sectionType, pattern] of Object.entries(sectionHeaders)) {
      if (pattern.test(line)) {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        currentSection = {
          type: sectionType as ParsedResume['metadata']['sections'][0]['type'],
          content: '',
          confidence: 0.8
        };
        sectionDetected = true;
        break;
      }
    }

    if (!sectionDetected) {
      currentSection.content += line + '\n';
    }
  }

  // Add the last section
  if (currentSection.content) {
    sections.push(currentSection);
  }

  // Attempt to detect name from the beginning of the resume
  const potentialName = lines[0];
  if (potentialName && !emailPattern.test(potentialName) && !phonePattern.test(phonePattern)) {
    metadata.detected_name = potentialName;
  }

  metadata.sections = sections;
  return metadata;
}

// Change this route to match exactly what the frontend is requesting
router.post('/', upload.single('file'), async (req, res) => {
  console.log("Received file upload request");
  
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Processing file of type ${req.file.mimetype}, size ${req.file.size} bytes`);
    
    const { mimetype, buffer } = req.file;
    let text = '';

    switch (mimetype) {
      case 'application/pdf':
        console.log("Extracting text from PDF");
        //text = await extractTextFromPDF(buffer);
        const textItems = await readPdf(buffer);
        // Group text items into lines
        //const lines = groupTextItemsIntoLines(textItems);

        // Group lines into sections
        //const sections = groupLinesIntoSections(lines);

        // Extract resume from sections
        //const resume = extractResumeFromSections(sections);
        res.status(200).json({ message: 'PDF parsing logic integrated', textItems });
        break;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        console.log("Extracting text from Word document");
        text = await extractTextFromDOCX(buffer);
        break;
      case 'text/plain':
        console.log("Processing text file");
        text = buffer.toString('utf-8');
        break;
      default:
        console.log(`Unsupported file type: ${mimetype}`);
        return res.status(400).json({
          error: 'Unsupported file type',
          supportedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
          ]
        });
    }

    if (!text || text.trim().length < 50) {
      console.log("Insufficient text extracted");
      return res.status(400).json({
        error: 'Insufficient text content',
        detail: 'The document contains very little text. If this is a scanned document, please convert it to searchable PDF first.'
      });
    }

    // Parse and structure the extracted text
    const metadata = parseResumeContent(text);
    
    console.log(`Successfully extracted and parsed ${text.length} characters of text`);
    return res.status(200).json({ 
      text,
      metadata 
    });
  } catch (error) {
    console.error('Text extraction error:', error);
    return res.status(500).json({
      error: 'Failed to extract text',
      detail: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;
