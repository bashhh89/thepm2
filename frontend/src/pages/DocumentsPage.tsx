import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthGuard } from '../components/AuthGuard';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DocumentType } from '../types/documents';

interface DocumentInfo {
  id: string;
  title: string;
  type: DocumentType;
  updatedAt: string;
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Create documents directory if it doesn't exist
        try {
          await window.puter.fs.mkdir('/documents');
        } catch (error) {
          // Directory might already exist
        }

        // List all documents
        const files = await window.puter.fs.readdir('/documents');
        const docPromises = files
          .filter(file => file.endsWith('.json'))
          .map(async (file) => {
            const content = await window.puter.fs.read(`/documents/${file}`);
            const doc = JSON.parse(content);
            return {
              id: doc.id,
              title: doc.title || 'Untitled Document',
              type: doc.type,
              updatedAt: doc.updatedAt
            };
          });

        const loadedDocs = await Promise.all(docPromises);
        setDocuments(loadedDocs.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleCreateDocument = () => {
    navigate('/dashboard/documents/create');
  };

  const handleDocumentClick = (docId: string) => {
    navigate(`/dashboard/documents/${docId}`);
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Button onClick={handleCreateDocument}>Create Document</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Recent Documents</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Recently edited documents
                </p>
                <div className="space-y-2">
                  {documents.slice(0, 5).map(doc => (
                    <Button
                      key={doc.id}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => handleDocumentClick(doc.id)}
                    >
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Templates</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start from pre-made document templates
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/dashboard/documents/templates')}
                  >
                    Browse Templates
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Common document actions
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.puter.ui.openFilePicker()}
                  >
                    Import Document
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleCreateDocument}
                  >
                    Create New
                  </Button>
                </div>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">All Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(doc => (
                  <Card 
                    key={doc.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleDocumentClick(doc.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} · {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
