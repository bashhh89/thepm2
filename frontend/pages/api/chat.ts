import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, leadId, name, email } = req.body;

    if (!message || !leadId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store chat message in Supabase
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert([
        {
          lead_id: leadId,
          message,
          sender: 'user',
          created_at: new Date().toISOString()
        }
      ]);

    if (chatError) {
      console.error('Failed to store chat message:', chatError);
      throw new Error('Failed to store chat message');
    }

    // For demo purposes, we'll send a simple response
    // TODO: Replace with your actual AI chat integration
    const responses = [
      "I'll help you with that right away!",
      "Thanks for your question. Let me check that for you.",
      "I understand what you're asking. Here's what you need to know...",
      "That's a great question! Here's the information you're looking for...",
      "I'd be happy to help you with that.",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Store bot response
    const { error: botError } = await supabase
      .from('chat_messages')
      .insert([
        {
          lead_id: leadId,
          message: randomResponse,
          sender: 'bot',
          created_at: new Date().toISOString()
        }
      ]);

    if (botError) {
      console.error('Failed to store bot message:', botError);
      // Continue even if bot message storage fails
    }

    // Simulate a small delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json({ 
      response: randomResponse,
      leadId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 