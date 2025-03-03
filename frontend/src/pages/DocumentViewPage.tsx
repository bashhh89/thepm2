import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentEditor } from '../components/document-editor/DocumentEditor';
import { AuthGuard } from '../components/AuthGuard';
import { Button } from '../components/Button';
import { Document } from '../types/documents';

export default function DocumentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return;
      try {
        const file = await window.puter.fs.read(`/documents/${id}.json`);
        setDocument(JSON.parse(file));
      } catch (error) {
        console.error('Failed to load document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  const handleSave = async (content: any) => {
    if (!document || !id) return;

    try {
      const updatedDoc = {
        ...document,
        content,
        updatedAt: new Date().toISOString()
      };

      await window.puter.fs.write(
        `/documents/${id}.json`,
        JSON.stringify(updatedDoc, null, 2)
      );

      setDocument(updatedDoc);
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading document...</div>
        </div>
      </AuthGuard>
    );
  }

  if (!document) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Document not found</div>
          <Button 
            className="mt-4"
            onClick={() => navigate('/dashboard/documents')}
          >
            Back to Documents
          </Button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/documents')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Documents
          </Button>
          <h1 className="text-3xl font-bold">{document.title}</h1>
        </div>
        
        <DocumentEditor
          documentId={id}
          initialBlocks={document.content}
          documentType={document.type}
          onSave={handleSave}
        />
      </div>
    </AuthGuard>
  );
}