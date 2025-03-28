/**
 * Model Context Protocol (MCP) Helper Functions
 * 
 * These functions provide a simple interface to work with Pollinations' MCP
 * capabilities, allowing AI assistants to generate images and audio directly.
 */

import { MCPDirective } from './pollinationsApi';
import { useState } from 'react';
import { useChatStore, Message, MessageContent } from '@/store/chatStore';
import { useSettingsStore } from '@/store/settingsStore';

// Regular expressions for identifying MCP directives
const imageDirectiveRegex = /!generate\s+image:?\s*(.+?)(?=!generate|$)/gi;
const audioDirectiveRegex = /!generate\s+audio:?\s*(.+?)(?=!generate|$)/gi;

/**
 * React hook for handling MCP requests
 * @returns Object with sendRequest function
 */
export function useMcpRequest() {
  const addMessage = useChatStore(state => state.addMessage);
  const setIsGenerating = useChatStore(state => state.setIsGenerating);

  const sendRequest = async (userInput: string, agent = null, selectedAgentId = null) => {
    try {
      // Get the latest state inside the function where it's needed
      const settingsState = useSettingsStore.getState();
      // Use provided agent or get active agent from settings
      const activeAgent = agent || settingsState.activeAgent;
      
      // Get the appropriate model for this agent
      // Use the agent's preferred model if available, otherwise use the global active model
      const textModel = activeAgent.modelPreferences?.textModel || settingsState.activeTextModel;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: useChatStore.getState().getActiveChatMessages(),
          model: textModel,
          systemPrompt: activeAgent.systemPrompt || "You are a helpful assistant.",
          agentId: selectedAgentId // Pass the selectedAgentId to the API
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Process mcpDirectives if any
      const assistantMessageContent: MessageContent[] = [{ type: 'text', content: data.message }];
      
      if (data.mcpDirectives && Array.isArray(data.mcpDirectives)) {
        // Get the latest settings state again to ensure we have the most up-to-date values
        const currentSettings = useSettingsStore.getState();
        
        data.mcpDirectives.forEach((directive: MCPDirective) => {
          // Use agent's preferred models for directives if available
          let content;
          if (directive.type === 'image') {
            const imageModel = activeAgent.modelPreferences?.imageModel || currentSettings.activeImageModel;
            content = generateMCPImageUrl(directive.content, { model: imageModel });
          } else {
            const voice = activeAgent.modelPreferences?.voiceModel || currentSettings.activeVoice;
            content = generateMCPAudioUrl(directive.content, voice);
          }
          
          assistantMessageContent.push({
            type: directive.type as "image" | "audio",
            content
          });
        });
      }
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantMessageContent
      };
      
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error in MCP request:', error);
      throw error;
    }
  };

  // Return the function
  return { sendRequest };
}

/**
 * Generate an image URL for MCP
 * @param prompt The text prompt to generate an image from
 * @param options Optional settings like dimensions and model
 * @returns Image URL that can be embedded directly
 */
export function generateMCPImageUrl(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    model?: string;
    negativePrompt?: string;
  } = {}
): string {
  const encodedPrompt = encodeURIComponent(prompt);
  const width = options.width || 1024;
  const height = options.height || 1024;
  const model = options.model || 'flux.schnell';
  const negativePrompt = options.negativePrompt ? `&negative=${encodeURIComponent(options.negativePrompt)}` : '';
  
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}${negativePrompt}&nologo=true`;
}

/**
 * Generate audio URL for MCP
 * @param text The text to convert to speech
 * @param voice Voice ID to use
 * @returns Audio URL that can be embedded directly
 */
export function generateMCPAudioUrl(
  text: string,
  voice: string = 'alloy'
): string {
  // Add a special prefix to force the API to treat this as plain TTS rather than a new query
  const speechText = `Read this text: ${text}`;
  const encodedText = encodeURIComponent(speechText);
  return `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}&format=speech`;
}

/**
 * Helper function to create an MCP image markdown string
 * @param prompt Image description
 * @param options Image generation options
 * @returns Markdown string for MCP
 */
export function mcpImageMarkdown(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    model?: string;
    alt?: string;
  } = {}
): string {
  const imageUrl = generateMCPImageUrl(prompt, options);
  const alt = options.alt || prompt;
  return `![${alt}](${imageUrl})`;
}

/**
 * Helper function to create an MCP audio markdown string
 * @param text Text to convert to speech
 * @param voice Voice ID
 * @returns Markdown string for MCP
 */
export function mcpAudioMarkdown(text: string, voice: string = 'alloy'): string {
  const audioUrl = generateMCPAudioUrl(text, voice);
  return `<audio controls src="${audioUrl}"></audio>`;
}

/**
 * Generate a full MCP response with both text and media
 * @param text Text response
 * @param mediaOptions Options for generating media
 * @returns Combined MCP response
 */
export function createMCPResponse(
  text: string,
  mediaOptions?: {
    imagePrompt?: string;
    imageModel?: string;
    audioText?: string;
    audioVoice?: string;
  }
): string {
  let response = text;
  
  if (mediaOptions?.imagePrompt) {
    const imageMarkdown = mcpImageMarkdown(mediaOptions.imagePrompt, {
      model: mediaOptions.imageModel || 'flux.schnell'
    });
    response += '\n\n' + imageMarkdown;
  }
  
  if (mediaOptions?.audioText) {
    const audioMarkdown = mcpAudioMarkdown(
      mediaOptions.audioText,
      mediaOptions.audioVoice || 'alloy'
    );
    response += '\n\n' + audioMarkdown;
  }
  
  return response;
}

/**
 * Extract MCP directives from a text response
 */
export function extractMCPDirectives(text: string): { 
  cleanText: string;
  mcpDirectives: MCPDirective[];
} {
  let cleanText = text;
  const mcpDirectives: MCPDirective[] = [];
  
  // Extract image directives
  const imageMatches = [...text.matchAll(imageDirectiveRegex)];
  for (const match of imageMatches) {
    const [fullMatch, content] = match;
    if (content && content.trim()) {
      mcpDirectives.push({
        type: 'image',
        content: content.trim()
      });
      
      // Remove directive from clean text
      cleanText = cleanText.replace(fullMatch, '');
    }
  }
  
  // Extract audio directives
  const audioMatches = [...text.matchAll(audioDirectiveRegex)];
  for (const match of audioMatches) {
    const [fullMatch, content] = match;
    if (content && content.trim()) {
      mcpDirectives.push({
        type: 'audio',
        content: content.trim()
      });
      
      // Remove directive from clean text
      cleanText = cleanText.replace(fullMatch, '');
    }
  }
  
  // Clean up any extra whitespace
  cleanText = cleanText.trim();
  
  return {
    cleanText,
    mcpDirectives
  };
}

/**
 * Create a system prompt that enables MCP capabilities
 */
export function createMCPSystemPrompt(basePrompt: string): string {
  return `${basePrompt}

You can generate images and audio for the user with these commands:
- To generate an image: !generate image: [detailed image description]
- To generate audio (text-to-speech): !generate audio: [text to convert to speech]

Example for generating an image:
!generate image: A beautiful mountain landscape at sunset with purple and orange sky

Example for generating audio:
!generate audio: Hello, this is a test of the text-to-speech system.`;
}

/**
 * Parse the response from Pollinations API to handle MCP directives
 * @param response The API response to parse 
 * @returns Parsed message and MCP directives
 */
export function parseMCPResponse(response: any): {
  message: string;
  mcpDirectives: MCPDirective[];
} {
  try {
    // Handle different types of responses from the API
    let text = '';
    
    // Handle case where response is already a string
    if (typeof response === 'string') {
      text = response;
    }
    // Handle case where response contains text field
    else if (response && typeof response.text === 'string') {
      text = response.text;
    }
    // Handle case where response might be structured differently
    else if (response && typeof response.content === 'string') {
      text = response.content;
    }
    // Handle unexpected response format
    else {
      try {
        // Try to stringify and use the whole response as text
        text = JSON.stringify(response);
      } catch (e) {
        // Fallback if stringification fails
        text = "Couldn't parse response from the AI.";
      }
    }
    
    // Extract MCP directives from the text
    const { cleanText, mcpDirectives } = extractMCPDirectives(text);
    
    return {
      message: cleanText,
      mcpDirectives
    };
  } catch (error) {
    console.error("Error parsing MCP response:", error);
    return {
      message: "There was an error processing the AI's response.",
      mcpDirectives: []
    };
  }
}