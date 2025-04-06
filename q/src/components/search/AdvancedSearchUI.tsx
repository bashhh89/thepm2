'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import Markdown from 'react-markdown';
import { Loader2, Send, BookOpen, Search, RotateCcw, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { Textarea } from "../../components/ui/textarea";

// Define search goals for the wizard
const SEARCH_GOALS = [
  {
    id: 'business-formation',
    label: 'Business Formation',
    description: 'Learn about starting a business, legal requirements, and best practices',
    icon: '🏢'
  },
  {
    id: 'competitive-analysis',
    label: 'Competitive Analysis',
    description: 'Research competitors, market positioning, and competitive landscape',
    icon: '📊'
  },
  {
    id: 'market-research',
    label: 'Market Research',
    description: 'Understand market size, trends, customer segments, and growth potential',
    icon: '📈'
  },
  {
    id: 'investment-research',
    label: 'Investment Research',
    description: 'Evaluate investment opportunities, risks, and potential returns',
    icon: '💰'
  },
  {
    id: 'industry-trends',
    label: 'Industry Trends',
    description: 'Discover emerging trends, innovations, and disruptions in specific industries',
    icon: '🔮'
  }
];

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AdvancedSearchResponse {
  success: boolean;
  synthesizedAnswer?: string;
  error?: string;
  metadata?: {
    searchQueries: string[];
    executionTimeMs: number;
    contextUsed?: {
      goal?: string;
      location?: string;
      businessType?: string;
      industry?: string;
      priorQueries?: string[];
    };
    suggestedFollowups?: string[];
  };
}

interface SuggestedQuestion {
  id: string;
  text: string;
}

export default function AdvancedSearchUI() {
  // State management
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [searchContext, setSearchContext] = useState<Record<string, string>>({});
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdvancedSearchResponse | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Scroll to bottom of message container when conversation history changes
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handleGoalSelection = (goalId: string) => {
    setSelectedGoal(goalId);
    setSearchContext(prevContext => ({ ...prevContext, goal: goalId }));
    
    // Set initial assistant message based on selected goal
    let assistantMessage = '';
    if (goalId === 'business-formation') {
      assistantMessage = "I'll help you research business formation. What type of business are you interested in starting? And in which location?";
    } else if (goalId === 'competitive-analysis') {
      assistantMessage = "I'll help you analyze the competitive landscape. Which industry or specific companies would you like to research?";
    } else if (goalId === 'market-research') {
      assistantMessage = "I'll help you conduct market research. Which industry, product, or service would you like to explore?";
    } else if (goalId === 'investment-research') {
      assistantMessage = "I'll help you research investment opportunities. Which market, asset class, or specific investment are you considering?";
    } else if (goalId === 'industry-trends') {
      assistantMessage = "I'll help you explore industry trends. Which specific industry would you like to learn more about?";
    }
    
    // Update conversation history with system message and initial assistant response
    setConversationHistory([
      {
        role: 'system' as const,
        content: `Advanced search session for ${SEARCH_GOALS.find(goal => goal.id === goalId)?.label} research.`
      },
      {
        role: 'assistant' as const,
        content: assistantMessage
      }
    ]);
    
    // Generate suggested follow-up questions based on the goal
    generateSuggestedQuestions(goalId);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Update conversation with user message
    const updatedConversation = [
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ];
    setConversationHistory(updatedConversation);
    setCurrentMessage('');
    
    try {
      // Update context based on user message
      updateSearchContext(message);
      
      // Prepare search query with context
      const searchQuery = prepareSearchQuery(message, searchContext, selectedGoal || '');
      
      // Call the API
      const response = await fetch('/api/advanced-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          context: {
            goal: selectedGoal,
            ...searchContext,
            priorQueries: conversationHistory
              .filter(msg => msg.role === 'user')
              .map(msg => msg.content)
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: AdvancedSearchResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }
      
      // Add assistant response to conversation
      setConversationHistory([
        ...updatedConversation,
        { 
          role: 'assistant' as const, 
          content: data.synthesizedAnswer || 'I couldn\'t find any relevant information for your query.'
        }
      ]);
      
      // Update result and suggested follow-up questions
      setResult(data);
      
      // Generate suggested follow-up questions from API response
      if (data.metadata?.suggestedFollowups && data.metadata.suggestedFollowups.length > 0) {
        setSuggestedQuestions(
          data.metadata.suggestedFollowups.map((q, index) => ({
            id: `suggestion-${index}`,
            text: q
          }))
        );
      } else {
        // If no suggestions from API, generate new ones
        generateSuggestedQuestions(selectedGoal || '', message);
      }
      
    } catch (err) {
      console.error('Error performing advanced search:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Add error message to conversation
      setConversationHistory([
        ...updatedConversation,
        { 
          role: 'assistant' as const, 
          content: 'I encountered an error while searching. Please try again or rephrase your query.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setCurrentMessage(question);
    handleSendMessage(question);
  };

  const updateSearchContext = (message: string) => {
    // Extract potential context from user message
    const locationMatch = message.match(/\b(?:in|at|near|for)\s+([A-Za-z\s,]+)(?:\b|$)/i);
    if (locationMatch && locationMatch[1] && locationMatch[1].length > 2) {
      setSearchContext(prev => ({ ...prev, location: locationMatch[1].trim() }));
    }
    
    // Extract business type
    const businessTypeMatch = message.match(/\b(?:LLC|Corporation|Inc|Sole Proprietorship|Partnership|S-Corp|C-Corp)\b/i);
    if (businessTypeMatch && businessTypeMatch[0]) {
      setSearchContext(prev => ({ ...prev, businessType: businessTypeMatch[0] }));
    }
    
    // Extract industry
    const industryKeywords = [
      'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 
      'Education', 'Entertainment', 'Food', 'Transportation', 'Real Estate'
    ];
    
    for (const industry of industryKeywords) {
      if (message.toLowerCase().includes(industry.toLowerCase())) {
        setSearchContext(prev => ({ ...prev, industry }));
        break;
      }
    }
  };

  const prepareSearchQuery = (message: string, context: Record<string, string>, goal: string) => {
    // Base query is the user's message
    let query = message;
    
    // No need for additional modifications as the API now handles context enhancement
    return query;
  };

  const generateSuggestedQuestions = (goalId: string, previousQuery?: string) => {
    let questions: SuggestedQuestion[] = [];
    
    // Generate goal-specific starter questions if this is initial selection
    if (!previousQuery) {
      if (goalId === 'business-formation') {
        questions = [
          { id: 'bf-1', text: 'What are the legal requirements for forming an LLC?' },
          { id: 'bf-2', text: 'How do taxes work for different business entities?' },
          { id: 'bf-3', text: 'What permits and licenses do I need to start a business?' }
        ];
      } else if (goalId === 'competitive-analysis') {
        questions = [
          { id: 'ca-1', text: 'Who are the market leaders in the tech industry?' },
          { id: 'ca-2', text: 'What competitive advantages do top companies have?' },
          { id: 'ca-3', text: 'How do I conduct a SWOT analysis of my competitors?' }
        ];
      } else if (goalId === 'market-research') {
        questions = [
          { id: 'mr-1', text: 'What is the market size for sustainable products?' },
          { id: 'mr-2', text: 'Who are the key customer segments in fintech?' },
          { id: 'mr-3', text: 'What are the current trends in e-commerce?' }
        ];
      } else if (goalId === 'investment-research') {
        questions = [
          { id: 'ir-1', text: 'What are the best performing sectors in the stock market?' },
          { id: 'ir-2', text: 'How do I evaluate a startup for potential investment?' },
          { id: 'ir-3', text: 'What are the risks of investing in cryptocurrency?' }
        ];
      } else if (goalId === 'industry-trends') {
        questions = [
          { id: 'it-1', text: 'What are the emerging technologies in healthcare?' },
          { id: 'it-2', text: 'How is AI transforming the retail industry?' },
          { id: 'it-3', text: 'What sustainability trends are affecting manufacturing?' }
        ];
      }
    } else {
      // These would normally be context-aware, but we'll generate some placeholders
      // In the actual implementation, this branch should rarely be hit since the API provides suggestions
      questions = [
        { id: 'fq-1', text: 'Can you provide more specific details about this topic?' },
        { id: 'fq-2', text: 'What are the next steps I should consider?' },
        { id: 'fq-3', text: 'Are there any alternatives I should be aware of?' }
      ];
    }
    
    setSuggestedQuestions(questions);
  };

  const handleReset = () => {
    setSelectedGoal(null);
    setSearchContext({});
    setConversationHistory([]);
    setCurrentMessage('');
    setResult(null);
    setSuggestedQuestions([]);
    setError(null);
  };

  // Handle copy to clipboard functionality
  const handleCopyMarkdown = async () => {
    if (result?.synthesizedAnswer) {
      try {
        await navigator.clipboard.writeText(result.synthesizedAnswer);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="w-full">
      {!selectedGoal ? (
        // Goal selection screen
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <h2 className="text-xl font-medium col-span-full mb-2">Select a research goal:</h2>
          
          {SEARCH_GOALS.map((goal) => (
            <Card 
              key={goal.id}
              className="p-4 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => handleGoalSelection(goal.id)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{goal.icon}</div>
                <div>
                  <h3 className="font-medium">{goal.label}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{goal.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Research interface with 70/30 split
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          {/* Left column (70%) - Chat interface */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-medium">{SEARCH_GOALS.find(g => g.id === selectedGoal)?.label}</h2>
                <p className="text-muted-foreground text-sm">Ask follow-up questions to refine your research</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSelectedGoal(null);
                  setConversationHistory([]);
                  setResult(null);
                }} 
                className="text-xs flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Change Goal
              </Button>
            </div>
            
            {/* Message container */}
            <div 
              className="bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 h-[400px] overflow-y-auto p-4"
              ref={messageContainerRef}
            >
              {conversationHistory.map((message, index) => {
                // Skip system messages from displaying
                if (message.role === 'system') return null;
                
                return (
                  <div 
                    key={index} 
                    className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                  >
                    <div 
                      className={`inline-block max-w-[85%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-zinc-200 dark:bg-zinc-800 rounded-tl-none'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose dark:prose-invert prose-sm">
                          <Markdown>{message.content}</Markdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                );
              })}
              
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-lg rounded-tl-none inline-flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Researching...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input area */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a specific question about your research topic..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(currentMessage);
                  }
                }}
              />
              <Button 
                disabled={isLoading || !currentMessage.trim()} 
                onClick={() => handleSendMessage(currentMessage)}
                className="shrink-0"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
          </div>
          
          {/* Right column (30%) - Context and suggestions */}
          <div className="lg:col-span-4 space-y-4">
            {/* Research context panel */}
            <Card className="p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Search size={16} /> Research Context
              </h3>
              <div className="space-y-2">
                {Object.entries(searchContext).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="text-muted-foreground capitalize">{key}: </span>
                    <Badge variant="outline" className="ml-1">{value}</Badge>
                  </div>
                ))}
                {Object.keys(searchContext).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Ask questions to build research context
                  </p>
                )}
              </div>
            </Card>
            
            {/* Copy to markdown button */}
            {result?.synthesizedAnswer && (
              <Card className="p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <BookOpen size={16} /> Research Summary
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs flex items-center justify-center gap-1"
                  onClick={() => {
                    if (result?.synthesizedAnswer) {
                      navigator.clipboard.writeText(result.synthesizedAnswer);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  }}
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 size={14} /> Copied to clipboard
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy as Markdown
                    </>
                  )}
                </Button>
              </Card>
            )}
            
            {/* Suggested questions */}
            {suggestedQuestions.length > 0 && (
              <Card className="p-4">
                <h3 className="font-medium mb-2">Suggested Questions</h3>
                <div className="space-y-2">
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleSuggestedQuestionClick(question.text)}
                    >
                      <ArrowRight size={12} className="mr-2 shrink-0" />
                      <span className="truncate">{question.text}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 