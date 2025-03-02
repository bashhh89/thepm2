import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentEditor } from '../../components/document-editor/DocumentEditor';
import { AIGeneratedContent } from '../../components/document-editor/AIGeneratedContent';
import { AuthGuard } from '../../components/AuthGuard';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { DocumentType } from '../../types/documents';
import { DocumentTemplateSelector } from '../../components/document-editor/DocumentTemplateSelector';
import { DocumentToolbar } from '../../components/document-editor/DocumentToolbar';
import { useAIAssistant } from '../../hooks/useAIAssistant';

export default function DocumentCreatePage() {
  const navigate = useNavigate();
  const { handleAIAction } = useAIAssistant();
  const [documentType, setDocumentType] = useState<DocumentType>('document');
  const [showEditor, setShowEditor] = useState(false);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [initialContent, setInitialContent] = useState<Block[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [sectionCount, setSectionCount] = useState(3);
  const [contentLength, setContentLength] = useState<'short' | 'medium' | 'long'>('medium');

  const handleGenerateFromTopic = () => {
    if (!topicInput.trim()) {
      window.puter.ui.alert({
        title: 'Error',
        message: 'Please enter a topic first'
      });
      return;
    }
    setShowAIGeneration(true);
    setShowTemplateSelect(false);
  };

  const handleAIContentGenerated = (blocks: Block[]) => {
    setInitialContent(blocks);
    setShowEditor(true);
    setShowAIGeneration(false);
    setShowTopicInput(false);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    if (template.structure) {
      const blocks = template.structure.sections.map(section => ({
        id: Date.now().toString() + Math.random(),
        type: 'text',
        content: `## ${section}\n\nAdd content here...`
      }));
      setInitialContent(blocks);
      setShowEditor(true);
      setShowTemplateSelect(false);
      setShowTopicInput(false);
    }
  };

  const handleAIAssist = async (action: string) => {
    const content = initialContent.map(block => block.content).join('\n\n');
    const result = await handleAIAction(action, content);
    
    if (Array.isArray(result)) {
      window.puter.ui.alert({
        title: 'AI Suggestions',
        message: result.join('\n\n')
      });
    } else if (typeof result === 'object') {
      const newBlocks = [];
      
      if (result.content) {
        newBlocks.push({
          id: Date.now().toString(),
          type: 'text',
          content: result.content
        });
      }

      if (result.images?.length) {
        newBlocks.push(...result.images.map(img => ({
          id: Date.now().toString(),
          type: 'image',
          content: img
        })));
      }

      if (result.charts?.length) {
        newBlocks.push(...result.charts.map(chart => ({
          id: Date.now().toString(),
          type: 'chart',
          content: JSON.stringify(chart)
        })));
      }

      if (result.tables?.length) {
        newBlocks.push(...result.tables.map(table => ({
          id: Date.now().toString(),
          type: 'data',
          content: JSON.stringify(table)
        })));
      }

      setInitialContent(prev => [...prev, ...newBlocks]);
    } else if (typeof result === 'string') {
      setInitialContent([{
        id: Date.now().toString(),
        type: 'text',
        content: result
      }]);
    }
  };

  const handleDocumentCreate = async (content: any) => {
    try {
      const docId = Date.now().toString();
      const docData = {
        id: docId,
        type: documentType,
        content,
        title: 'Untitled Document',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await window.puter.fs.mkdir('/documents');
      } catch (error) {
      }

      await window.puter.fs.write(
        `/documents/${docId}.json`,
        JSON.stringify(docData, null, 2)
      );

      navigate(`/dashboard/documents/${docId}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  if (showAIGeneration) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <AIGeneratedContent
            topic={topicInput}
            documentType={documentType}
            onGenerated={handleAIContentGenerated}
            onCancel={() => setShowAIGeneration(false)}
            sectionCount={sectionCount}
            contentLength={contentLength}
          />
        </div>
      </AuthGuard>
    );
  }

  if (showTopicInput) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowTopicInput(false)}
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
              Back
            </Button>
            <h1 className="text-3xl font-bold">Create New {documentType}</h1>
          </div>

          {showAIGeneration ? (
            <AIGeneratedContent
              topic={topicInput}
              documentType={documentType}
              onGenerated={handleAIContentGenerated}
              onCancel={() => setShowAIGeneration(false)}
              sectionCount={sectionCount}
              contentLength={contentLength}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">What would you like to create?</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter your topic or idea</label>
                    <textarea
                      className="w-full p-3 h-32 rounded-md border bg-background resize-none"
                      placeholder="Example: A comprehensive guide to artificial intelligence in business, including real-world applications, implementation strategies, and future trends."
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Sections</label>
                      <select
                        className="w-full p-2 rounded-md border bg-background"
                        value={sectionCount}
                        onChange={(e) => setSectionCount(Number(e.target.value))}
                      >
                        {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num} sections</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content Length</label>
                      <select
                        className="w-full p-2 rounded-md border bg-background"
                        value={contentLength}
                        onChange={(e) => setContentLength(e.target.value as 'short' | 'medium' | 'long')}
                      >
                        <option value="short">Brief</option>
                        <option value="medium">Standard</option>
                        <option value="long">Detailed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      className="flex-1" 
                      onClick={() => setShowTemplateSelect(true)}
                    >
                      Choose Template
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleGenerateFromTopic}
                    >
                      Generate with AI
                    </Button>
                  </div>
                </div>
              </Card>

              {showTemplateSelect && (
                <DocumentTemplateSelector
                  documentType={documentType}
                  onSelect={handleTemplateSelect}
                  selectedTemplate={selectedTemplate}
                  topic={topicInput}
                  sectionCount={sectionCount}
                  contentLength={contentLength}
                />
              )}
            </div>
          )}
        </div>
      </AuthGuard>
    );
  }

  if (showEditor) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <DocumentToolbar
            onSave={handleDocumentCreate}
            isSaving={false}
            onAIAssist={handleAIAssist}
          />
          <DocumentEditor
            documentType={documentType}
            initialContent={initialContent}
            onSave={handleDocumentCreate}
          />
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
          <h1 className="text-3xl font-bold">Create New Document</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => {
              setDocumentType('document');
              setShowTopicInput(true);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <div>
                <h3 className="font-semibold text-xl mb-2">Document</h3>
                <p className="text-muted-foreground">Create a rich text document with images and formatting</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => {
              setDocumentType('presentation');
              setShowTopicInput(true);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <div>
                <h3 className="font-semibold text-xl mb-2">Presentation</h3>
                <p className="text-muted-foreground">Create slides with visual content and animations</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => {
              setDocumentType('webpage');
              setShowTopicInput(true);
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <div>
                <h3 className="font-semibold text-xl mb-2">Webpage</h3>
                <p className="text-muted-foreground">Create a web page with interactive elements</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}