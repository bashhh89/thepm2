import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Input } from '../Input';

interface AIAssistantFloatingProps {
  onAction: (action: string, prompt?: string) => void;
  isVisible: boolean;
  position?: { x: number; y: number };
  selectedText?: string;
}

const AI_ACTIONS = [
  { id: 'continue', label: 'Continue writing...', icon: '✏️' },
  { id: 'expand', label: 'Expand this...', icon: '🔄' },
  { id: 'improve', label: 'Improve writing', icon: '⭐' },
  { id: 'summarize', label: 'Summarize', icon: '📝' },
  { id: 'tone', label: 'Change tone...', icon: '🎭' },
  { id: 'translate', label: 'Translate...', icon: '🌐' },
  { id: 'explain', label: 'Explain this', icon: '💡' },
  { id: 'bullets', label: 'Convert to bullets', icon: '•' }
];

export function AIAssistantFloating({ 
  onAction,
  isVisible,
  position,
  selectedText
}: AIAssistantFloatingProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showInput, setShowInput] = useState(false);

  if (!isVisible) return null;

  const handleActionClick = (actionId: string) => {
    onAction(actionId, selectedText);
  };

  const handleCustomAction = () => {
    if (customPrompt.trim()) {
      onAction('custom', customPrompt);
      setCustomPrompt('');
      setShowInput(false);
    }
  };

  return (
    <Card className="fixed w-72 shadow-lg z-50 bg-background/95 backdrop-blur" style={{
      top: position?.y ?? '50%',
      left: position?.x ?? '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">AI Assistant</div>
          <div className="text-xs text-muted-foreground">
            {selectedText ? 'Selected text' : 'Current block'}
          </div>
        </div>

        {!showInput ? (
          <div className="space-y-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              >
                <span className="text-lg">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowInput(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              <span className="text-lg">💭</span>
              <span>Ask anything else...</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              placeholder="What would you like the AI to do?"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomAction()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={handleCustomAction}
                disabled={!customPrompt.trim()}
              >
                Ask AI
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}