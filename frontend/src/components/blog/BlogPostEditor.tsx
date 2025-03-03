import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { Card } from '../Card';
import { useBlogStore, type BlogPost } from '../../utils/blog-store';
import { useAuthStore } from '../../utils/auth-store';
import { supabase } from '../../AppWrapper';

interface BlogPostEditorProps {
  postId?: string; // If editing an existing post
}

export default function BlogPostEditor({ postId }: BlogPostEditorProps) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const { getPost, createPost, updatePost, isSaving, isInitialized } = useBlogStore();
  const [currentUser, setCurrentUser] = useState(null);
  const isEditing = !!postId;

  useEffect(() => {
    // Get current Supabase user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // State for the blog post
  const [post, setPost] = useState<Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    coverImageType: 'url',
    author: user?.fullName || isAdmin ? 'Admin' : 'AI Assistant',
    publishDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    categories: [],
    tags: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentLength, setContentLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [previewMode, setPreviewMode] = useState(false);
  
  // Fetch existing post if editing
  useEffect(() => {
    if (isEditing && postId) {
      setIsLoading(true);
      const existingPost = getPost(postId);
      if (existingPost) {
        const { id, createdAt, updatedAt, ...postData } = existingPost;
        setPost(postData);
      }
      setIsLoading(false);
    }
  }, [postId, isEditing, getPost]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isInitialized) {
      window.alert('Please wait while the system initializes. This may take a few seconds.');
      return;
    }
    
    try {
      // Validate required fields with better feedback
      if (!post.title.trim()) {
        window.alert('Please enter a title for your post');
        return;
      }
      if (!post.excerpt.trim()) {
        window.alert('Please enter an excerpt for your post');
        return;
      }
      if (!post.content.trim()) {
        window.alert('Please enter content for your post');
        return;
      }

      let newPostId;
      if (isEditing && postId) {
        await updatePost(postId, post);
        newPostId = postId;
      } else {
        newPostId = await createPost(post, currentUser);
      }
      
      // Show success message
      const action = post.status === 'published' ? 'published' : 'saved as draft';
      window.alert(`Post successfully ${action}!`);
      
      // Navigate based on status
      if (post.status === 'published') {
        navigate(`/blog/${newPostId}`);
      } else {
        navigate('/dashboard/blog-posts');
      }
    } catch (error: any) {
      console.error('Failed to save post:', error);
      window.alert(error.message || 'Failed to save post. Please try again.');
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  // Handle array input changes (categories, tags)
  const handleArrayChange = (name: string, value: string) => {
    setPost(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  // Suggest a title based on website content
  const suggestTitle = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Create 3 engaging blog post titles for a business intelligence platform.
        Focus on AI technology, analytics, or digital transformation.
        Format exactly as:
        1. [First Title]
        2. [Second Title]
        3. [Third Title]
        
        Make each title unique and compelling.`;

      const response = await puter.ai.chat(prompt);
      const content = typeof response === 'string' ? response : 
        'message' in response ? response.message.content : 
        'text' in response ? response.text : '';

      console.log('AI Response:', content);

      const titles = content
        .split('\n')
        .filter((line: string) => /^\d\./.test(line))
        .map((line: string) => line.replace(/^\d\.\s+/, '').trim());

      if (titles.length > 0) {
        const selectedTitle = titles[0];
        setPost(prev => ({ ...prev, title: selectedTitle }));
        await generateSuggestionsByTitle(selectedTitle);
      } else {
        throw new Error('No valid title suggestions found');
      }
    } catch (error) {
      console.error('Error suggesting title:', error);
      alert('Unable to generate title suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTitleEnhancement = async () => {
    if (!post.title) {
      await suggestTitle();
      return;
    }
    
    setIsGenerating(true);
    try {
      const prompt = `As an AI content expert, enhance this blog post title: "${post.title}"
        Make it more engaging, SEO-friendly, and memorable while keeping the core topic.
        Each version should be unique in style:
        1. Make it actionable and benefit-focused
        2. Frame it as an intriguing question or curiosity gap
        3. Include specific numbers or data points if relevant
        
        Format your response exactly as:
        1. [First Version]
        2. [Second Version]
        3. [Third Version]
        
        Keep titles natural and avoid buzzwords.`;

      const response = await puter.ai.chat(prompt);
      const content = typeof response === 'string' ? response : 
        'message' in response ? response.message.content : 
        'text' in response ? response.text : '';

      console.log('AI Response:', content);

      // Extract titles using regex
      const titles = content
        .split('\n')
        .filter((line: string) => /^\d\./.test(line))
        .map((line: string) => line.replace(/^\d\.\s+/, '').trim());

      if (titles.length > 0) {
        // For now, use the first suggestion
        // TODO: Add a modal to let user choose from suggestions
        const selectedTitle = titles[0];
        setPost(prev => ({ ...prev, title: selectedTitle }));
        await generateSuggestionsByTitle(selectedTitle);
      } else {
        throw new Error('No valid title suggestions found');
      }
    } catch (error) {
      console.error('Error enhancing title:', error);
      alert('Unable to enhance title. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate suggestions based on title
  const generateSuggestionsByTitle = async (title: string) => {
    setIsGenerating(true);
    try {
      const prompt = `Based on this blog post title: "${title}"
        Create content suggestions for a business intelligence blog post.
        Format your response exactly as:
        
        EXCERPT:
        [2-3 compelling sentences that summarize the main points]

        CATEGORIES:
        [3-4 relevant categories, comma-separated]

        TAGS:
        [5-8 relevant tags, comma-separated]`;

      const response = await puter.ai.chat(prompt);
      const content = typeof response === 'string' ? response : 
        'message' in response ? response.message.content : 
        'text' in response ? response.text : '';

      console.log('AI Response:', content);

      // Extract sections using regex
      const excerptMatch = content.match(/EXCERPT:\s*\n([\s\S]*?)(?=\n\s*CATEGORIES:|$)/);
      const categoriesMatch = content.match(/CATEGORIES:\s*\n([\s\S]*?)(?=\n\s*TAGS:|$)/);
      const tagsMatch = content.match(/TAGS:\s*\n([\s\S]*?)(?=$)/);

      // Process the matches
      const excerpt = excerptMatch ? excerptMatch[1].trim() : '';
      const categories = categoriesMatch ? 
        categoriesMatch[1].split(',').map(c => c.trim()).filter(Boolean) : [];
      const tags = tagsMatch ?
        tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean) : [];

      setPost(prev => ({
        ...prev,
        excerpt,
        categories,
        tags
      }));
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert('Unable to generate suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateArticle = async () => {
    if (!post.title) return;
    
    setIsGenerating(true);
    try {
      const lengthGuide = {
        short: '500-800 words',
        medium: '1000-1500 words',
        long: '2000-2500 words'
      }[contentLength];

      const prompt = `Write a ${lengthGuide} blog post about: "${post.title}"
        Use this excerpt as guidance: "${post.excerpt}"
        
        Write in a professional but engaging tone. Focus on providing actionable insights and real-world applications.
        Format the article using markdown with:
        - Clear headings and subheadings
        - Bullet points for key concepts
        - Numbered lists for steps
        - Brief paragraphs for readability`;

      const response = await puter.ai.chat(prompt);
      const content = typeof response === 'string' ? response : 
        'message' in response ? response.message.content : 
        'text' in response ? response.text : '';

      console.log('AI Response:', content);

      setPost(prev => ({
        ...prev,
        content: content.trim()
      }));
    } catch (error) {
      console.error('Error generating article:', error);
      alert('Unable to generate article content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!post.title) return;
    
    setIsGenerating(true);
    try {
      const apiHost = 'https://api.stability.ai';
      const apiKey = 'sk-Wdwjx3sPE0plLdyQL8b5K9BxcRt3UWA3QvJXT76qgGyi7clD';

      // Generate a prompt based on the blog post title and content
      const imagePrompt = `Professional, highly detailed photograph representing: ${post.title}. 
        Style: Modern corporate photography, photorealistic, high resolution. 
        Theme: Business, technology, innovation.
        Composition: Clean, well-lit, 16:9 aspect ratio, suitable for a blog header image.
        Quality: Highly detailed, professional lighting, sharp focus.`;

      const response = await fetch(
        `${apiHost}/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: imagePrompt,
                weight: 1
              }
            ],
            cfg_scale: 7,
            width: 1152,
            height: 896,
            steps: 30,
            samples: 1,
            style_preset: "photographic"
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Stability AI request failed: ${response.statusText}`);
      }

      const responseData = await response.json();
      // The API returns base64-encoded images in artifacts array
      if (responseData.artifacts && responseData.artifacts.length > 0) {
        const generatedImage = responseData.artifacts[0];
        
        // Convert base64 to URL
        const imageUrl = `data:image/png;base64,${generatedImage.base64}`;
        
        setPost(prev => ({ 
          ...prev, 
          coverImage: imageUrl,
          coverImageType: 'generate'
        }));
      } else {
        throw new Error('No image generated');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      alert('Unable to generate image. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (isLoading || !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">
          {isLoading ? 'Loading post...' : 'Initializing storage system...'}
        </p>
      </div>
    );
  }

  // Simplified markdown renderer for preview
  const renderMarkdown = (markdown: string) => {
    const htmlContent = markdown
      .replace(/# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/## (.*$)/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
      .replace(/### (.*$)/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />');
    
    return { __html: htmlContent };
  };

  // Preview mode
  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Post Preview</h1>
          <Button onClick={() => setPreviewMode(false)}>
            Back to Editing
          </Button>
        </div>

        <Card className="p-6">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center mb-6">
              <span className="mr-3 font-medium">{post.author}</span>
              <span className="mx-3 text-muted-foreground">•</span>
              <span className="text-muted-foreground">{post.publishDate || new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          {post.coverImage && (
            <div className="mb-8 aspect-video rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={renderMarkdown(post.content)} />
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t">
            <h3 className="text-lg font-bold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard/blog-posts')}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                Preview
              </Button>
              <Button disabled={isSaving} onClick={handleSubmit}>
                {isSaving ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
                        Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter blog post title"
                      />
                    </div>
                    <Button 
                      type="button"
                      variant="secondary"
                      onClick={handleTitleEnhancement}
                      disabled={isGenerating}
                      className="flex items-center gap-2"
                    >
                      <span>✨</span> 
                      {isGenerating ? 'Generating...' : post.title ? 'Enhance with AI' : 'Suggest Title'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={post.excerpt}
                    onChange={handleChange}
                    rows={2}
                    className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Brief summary of your blog post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Cover Image</label>
                  <div className="border rounded-lg p-4 bg-background">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          {['url', 'upload', 'generate'].map((type) => (
                            <label key={type} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={post.coverImageType === type}
                                onChange={() => setPost(prev => ({ ...prev, coverImageType: type as 'url' | 'upload' | 'generate' }))}
                                className="radio border-input"
                              />
                              <span className="text-sm font-medium capitalize">{type === 'url' ? 'Image URL' : type === 'upload' ? 'Upload Image' : 'AI Generate'}</span>
                            </label>
                          ))}
                        </div>

                        <div className="mt-4">
                          {post.coverImageType === 'url' && (
                            <input
                              type="text"
                              name="coverImage"
                              value={post.coverImage}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Enter image URL"
                            />
                          )}
                          
                          {post.coverImageType === 'upload' && (
                            <input
                              type="file"
                              accept="image/*"
                              className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                          )}
                          
                          {post.coverImageType === 'generate' && (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Generate an AI image based on your blog post title and content.</p>
                              <Button
                                type="button"
                                onClick={generateImage}
                                disabled={!post.title || isGenerating}
                                className="w-full"
                              >
                                {isGenerating ? 'Generating...' : 'Generate Image with AI'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {post.coverImage && (
                        <div className="mt-4">
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={post.coverImage}
                              alt="Blog post cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Article Length</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={contentLength === 'short'}
                        onChange={() => setContentLength('short')}
                        className="mr-2"
                      />
                      <span>Short</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={contentLength === 'medium'}
                        onChange={() => setContentLength('medium')}
                        className="mr-2"
                      />
                      <span>Medium</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={contentLength === 'long'}
                        onChange={() => setContentLength('long')}
                        className="mr-2"
                      />
                      <span>Long</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Button
                    type="button"
                    onClick={generateArticle}
                    disabled={!post.title || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Article with AI'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={post.content}
                    onChange={handleChange}
                    rows={16}
                    className="flex h-40 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Blog post content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="categories" className="block text-sm font-medium text-foreground mb-1">
                      Categories
                    </label>
                    <input
                      id="categories"
                      value={post.categories.join(', ')}
                      onChange={(e) => handleArrayChange('categories', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter categories, separated by commas"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-1">
                      Tags
                    </label>
                    <input
                      id="tags"
                      value={post.tags.join(', ')}
                      onChange={(e) => handleArrayChange('tags', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter tags, separated by commas"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setPost(prev => ({ ...prev, status: 'draft' }));
                    handleSubmit(new Event('click') as any);
                  }}>
                    Save as Draft
                  </Button>
                  <Button type="button" onClick={() => {
                    setPost(prev => ({ ...prev, status: 'published' }));
                    handleSubmit(new Event('click') as any);
                  }}>
                    Publish
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}