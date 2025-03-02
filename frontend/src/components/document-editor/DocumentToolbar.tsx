import React, { useState } from 'react';
import { Button } from '../Button';
import { TranslationToolbar } from './TranslationToolbar';
import { useAIAssistant } from '../../hooks/useAIAssistant';

interface DocumentToolbarProps {
  onSave: (content: any) => Promise<void>;
  onPublish?: () => Promise<void>;
  isSaving: boolean;
  onAIAssist: (action: string) => Promise<void>;
}

export function DocumentToolbar({
  onSave,
  onPublish,
  isSaving,
  onAIAssist
}: DocumentToolbarProps) {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const { isGenerating } = useAIAssistant();

  const handleAIAction = async (action: string) => {
    try {
      await onAIAssist(action);
    } catch (error) {
      console.error('AI action failed:', error);
      window.puter.ui.alert({
        title: 'AI Action Failed',
        message: error instanceof Error ? error.message : 'Failed to perform AI action'
      });
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAIAction('enhance_style')}
            disabled={isGenerating}
          >
            ✨ Enhance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAIAction('add_visuals')}
            disabled={isGenerating}
          >
            📊 Add Visuals
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAIAction('suggest_improvements')}
            disabled={isGenerating}
          >
            💡 Suggest Improvements
          </Button>
          <TranslationToolbar
            onTranslate={(blocks) => onSave(blocks)}
            blocks={[]}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI is working...
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave([])}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            size="sm"
            onClick={() => onSave([])}
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}