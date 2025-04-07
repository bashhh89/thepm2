import { NextRequest, NextResponse } from 'next/server';
import { callPollinationsChat } from '@/lib/pollinationsApi';
import { parseCommand, formatCommandConfirmation } from '@/lib/ai/commandParser';
import { executeAction } from '@/lib/ai/actionHandler';
import { generateWorkspaceContextPrompt } from '@/lib/ai/workspaceContextProvider';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, workspaceId, conversationHistory = [] } = body;
    
    if (!message || !workspaceId) {
      return NextResponse.json(
        { error: 'Message and workspaceId are required' },
        { status: 400 }
      );
    }
    
    // Generate workspace context prompt
    const contextPrompt = await generateWorkspaceContextPrompt(workspaceId);
    
    // Create the system prompt that includes workspace context
    const systemPrompt = `You are an AI assistant for QanDu, helping users with their workspace. 
                Use the following workspace context to inform your responses:
                ${contextPrompt}
                
                When the user asks questions about their workspace, provide helpful information based on the context.
                When they want to take actions (like creating, updating, deleting entities), recognize the intent and execute it if possible.`;
    
    // Prepare the messages array for processing
    let apiMessages = [...conversationHistory];
    
    // Add the current user message
    apiMessages.push({
      role: 'user',
      content: message
    });
    
    // Parse the user message for commands
    const command = parseCommand(message);
    
    // If high confidence command, execute it directly
    if (command && command.confidence > 0.75) {
      // Use formatCommandConfirmation if available, otherwise create a simple confirmation
      const commandConfirmation = formatCommandConfirmation 
        ? formatCommandConfirmation(command)
        : `I'll ${command.type} the ${command.entityType} for you.`;
      
      try {
        // Execute the command
        const commandResult = await executeAction(command, workspaceId);
        
        return NextResponse.json({
          text: commandResult.message,
          isCommand: true,
          commandConfirmation,
          commandResult,
        });
      } catch (error) {
        console.error('Error executing command:', error);
        return NextResponse.json({
          text: `I tried to ${command.type} the ${command.entityType} but encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isCommand: true,
          commandConfirmation,
          commandResult: {
            status: 'error',
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          },
        });
      }
    }
    
    // For normal messages or low-confidence commands, use the LLM API
    const response = await callPollinationsChat(
      apiMessages,
      'openai',
      systemPrompt,
      false
    );
    
    // Extract the model's response text
    let assistantResponse = '';
    if (typeof response === 'string') {
      assistantResponse = response;
    } else {
      assistantResponse = response?.choices?.[0]?.message?.content || 
                          "Sorry, I couldn't generate a proper response.";
    }
    
    return NextResponse.json({
      text: assistantResponse,
      isCommand: false,
    });
    
  } catch (error) {
    console.error('Error in workspace-ai API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 