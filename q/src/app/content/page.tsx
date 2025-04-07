'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardUnified, CardUnifiedHeader, CardUnifiedTitle, CardUnifiedContent, CardUnifiedFooter } from '@/components/ui/card-unified';
import { ButtonUnified } from '@/components/ui/button-unified';
import HeaderUnified from '@/components/ui/header-unified';
import { layouts, componentStyles } from '@/lib/design-system';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Image, 
  Link, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Sparkles,
  History,
  Share2,
  Calendar,
  BarChart,
  FileText,
  ArrowRight,
  Eye,
  Settings
} from 'lucide-react';

interface Content {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  metadata: {
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    analytics?: {
      views?: number;
      engagement?: number;
    };
  };
}

export default function ContentEditor() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('write');
  const [content, setContent] = useState<Content>({
    id: '',
    title: '',
    content: '',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {}
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save functionality
  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (content.title || content.content) {
        await saveContent();
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [content]);

  const saveContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .upsert({
          ...content,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      // Call AI service to generate content
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content.title })
      });
      const data = await response.json();
      
      setContent(prev => ({
        ...prev,
        content: data.content
      }));
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 min-h-screen">
      <HeaderUnified 
        title="Content Editor" 
        description="Create and manage your content"
        icon={<FileText className="h-5 w-5" />}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Content" }
        ]}
        actions={
          <div className="flex space-x-3">
            <ButtonUnified variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </ButtonUnified>
            <ButtonUnified>
              Publish
            </ButtonUnified>
          </div>
        }
      />

      <div className={layouts.container}>
        {/* Action Bar */}
        <div className="mb-6 flex flex-wrap gap-3">
          <ButtonUnified variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History
          </ButtonUnified>
          <ButtonUnified variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </ButtonUnified>
          <ButtonUnified variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </ButtonUnified>
          <ButtonUnified variant="outline" size="sm">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </ButtonUnified>
          <ButtonUnified variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </ButtonUnified>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor */}
          <div className="lg:col-span-8">
            <CardUnified>
              <CardUnifiedContent>
                <Input
                  placeholder="Enter title..."
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  className={`text-2xl font-bold mb-4 ${componentStyles.input.transparent}`}
                />
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 bg-zinc-800">
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="write" className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bold className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Italic className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <List className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ListOrdered className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Quote className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Image className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Code className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Heading1 className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Heading2 className="w-4 h-4" />
                      </ButtonUnified>
                      <ButtonUnified variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Heading3 className="w-4 h-4" />
                      </ButtonUnified>
                    </div>

                    {/* Editor */}
                    <Textarea
                      ref={editorRef}
                      value={content.content}
                      onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
                      className={`min-h-[500px] ${componentStyles.input.transparent}`}
                      placeholder="Start writing..."
                    />
                  </TabsContent>

                  <TabsContent value="preview">
                    <CardUnified variant="secondary" className="p-6 min-h-[500px]">
                      <div className="prose prose-invert max-w-none">
                        <h1>{content.title}</h1>
                        <div dangerouslySetInnerHTML={{ __html: content.content }} />
                      </div>
                    </CardUnified>
                  </TabsContent>

                  <TabsContent value="seo">
                    <CardUnified variant="secondary" className="p-6">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-zinc-300">Meta Title</label>
                          <Input
                            value={content.metadata.seo?.title || ''}
                            onChange={(e) => setContent(prev => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                seo: { ...prev.metadata.seo, title: e.target.value }
                              }
                            }))}
                            className={componentStyles.input.base}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-zinc-300">Meta Description</label>
                          <Textarea
                            value={content.metadata.seo?.description || ''}
                            onChange={(e) => setContent(prev => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                seo: { ...prev.metadata.seo, description: e.target.value }
                              }
                            }))}
                            className={componentStyles.input.base}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-zinc-300">Keywords</label>
                          <Input
                            value={content.metadata.seo?.keywords?.join(', ') || ''}
                            onChange={(e) => setContent(prev => ({
                              ...prev,
                              metadata: {
                                ...prev.metadata,
                                seo: {
                                  ...prev.metadata.seo,
                                  keywords: e.target.value.split(',').map(k => k.trim())
                                }
                              }
                            }))}
                            className={componentStyles.input.base}
                          />
                        </div>
                      </div>
                    </CardUnified>
                  </TabsContent>
                </Tabs>
              </CardUnifiedContent>
            </CardUnified>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Assistant */}
            <CardUnified>
              <CardUnifiedHeader>
                <CardUnifiedTitle>AI Assistant</CardUnifiedTitle>
              </CardUnifiedHeader>
              <CardUnifiedContent>
                <p className="text-zinc-400 mb-4">
                  Let AI generate content based on your title. The generated content will be added to your editor.
                </p>
                <ButtonUnified
                  className="w-full"
                  onClick={generateContent}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </ButtonUnified>
              </CardUnifiedContent>
            </CardUnified>

            {/* Content Stats */}
            <CardUnified>
              <CardUnifiedHeader>
                <CardUnifiedTitle>Content Stats</CardUnifiedTitle>
              </CardUnifiedHeader>
              <CardUnifiedContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                    <label className="block text-sm text-zinc-400">Word Count</label>
                    <p className="text-xl font-bold">
                      {content.content.split(/\s+/).filter(Boolean).length}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                    <label className="block text-sm text-zinc-400">Reading Time</label>
                    <p className="text-xl font-bold">
                      {Math.ceil(content.content.split(/\s+/).filter(Boolean).length / 200)} min
                    </p>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                    <label className="block text-sm text-zinc-400">Status</label>
                    <div className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full text-xs border border-amber-500/20">
                      {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm text-zinc-400">Last Saved</label>
                    <p className="text-sm text-zinc-300">
                      {new Date(content.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardUnifiedContent>
            </CardUnified>
          </div>
        </div>
      </div>
    </div>
  );
} 