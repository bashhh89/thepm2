import { NextApiRequest, NextApiResponse } from 'next';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileBuffer, fileUrl } = req.body;
    
    let pdfBuffer: Buffer;
    
    if (fileBuffer) {
      // If file buffer is provided directly
      try {
        // Convert array back to Buffer
        pdfBuffer = Buffer.from(new Uint8Array(fileBuffer));
        
        // Verify it's a PDF by checking magic numbers
        if (pdfBuffer.slice(0, 4).toString('hex') !== '25504446') {
          return res.status(400).json({ error: 'Invalid PDF format' });
        }
      } catch (error) {
        console.error('Buffer conversion error:', error);
        return res.status(400).json({ error: 'Invalid file buffer format' });
      }
    } else if (fileUrl) {
      // If file URL is provided, download it
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to download PDF');
        const arrayBuffer = await response.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
        
        // Verify it's a PDF
        if (pdfBuffer.slice(0, 4).toString('hex') !== '25504446') {
          return res.status(400).json({ error: 'Invalid PDF format' });
        }
      } catch (error) {
        console.error('Error downloading PDF:', error);
        return res.status(400).json({ error: 'Failed to download or validate PDF file' });
      }
    } else {
      return res.status(400).json({ error: 'No file data provided' });
    }

    // Validate PDF buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(400).json({ error: 'Empty PDF data' });
    }

    // Parse PDF with options and timeout
    const data = await Promise.race([
      pdf(pdfBuffer, {
        max: 0, // No page limit
        version: 'v2.0.550',
        pagerender: function(pageData: any) {
          return pageData.getTextContent();
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('PDF parsing timed out')), 30000)
      )
    ]);
    
    if (!data || !data.text) {
      return res.status(400).json({ error: 'No text content found in PDF' });
    }

    // Clean and format the text
    const cleanText = data.text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .split('\n')  // Split into lines
      .map((line: string) => line.trim())  // Trim each line
      .filter((line: string) => line.length > 0)  // Remove empty lines
      .join('\n');  // Join back with newlines
    
    if (cleanText.length < 50) {
      return res.status(400).json({ 
        error: 'Insufficient text content in PDF',
        details: 'The PDF contains very little text. If this is a scanned document, please convert it to searchable PDF first.'
      });
    }
    
    // Return the extracted text
    res.status(200).json({ 
      text: cleanText,
      metadata: {
        pages: data.numpages,
        info: data.info,
        version: data.version
      }
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to extract PDF text';
    let details = '';
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'PDF processing timed out';
        details = 'The PDF file is too complex or large to process';
      } else if (error.message.includes('malformed')) {
        errorMessage = 'Invalid PDF format';
        details = 'The file appears to be corrupted or not a valid PDF';
      } else {
        details = error.message;
      }
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: details
    });
  }
} 