import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import {
  Language,
  LANGUAGES,
  translateDocument,
  detectLanguage,
  localizeForCulture
} from '../../utils/translation-service';

interface TranslationToolbarProps {
  onTranslate: (blocks: any[]) => void;
  blocks: any[];
  isTranslating?: boolean;
}

export function TranslationToolbar({
  onTranslate,
  blocks,
  isTranslating = false
}: TranslationToolbarProps) {
  const [showLanguages, setShowLanguages] = useState(false);
  const [showCultures, setShowCultures] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);

  const handleDetectLanguage = async () => {
    const textContent = blocks
      .filter(block => block.type === 'text')
      .map(block => block.content)
      .join('\n\n');

    if (textContent) {
      const detected = await detectLanguage(textContent);
      setDetectedLanguage(detected);
    }
  };

  const handleTranslate = async (targetLanguage: Language) => {
    try {
      const sourceLanguage = detectedLanguage || 'en';
      const translatedBlocks = await translateDocument(blocks, targetLanguage, sourceLanguage);
      onTranslate(translatedBlocks);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setShowLanguages(false);
    }
  };

  const handleLocalize = async (culture: string, style: 'formal' | 'casual' | 'marketing') => {
    try {
      const localizedBlocks = await Promise.all(
        blocks.map(async block => {
          if (block.type === 'text') {
            const localizedContent = await localizeForCulture(block.content, culture, style);
            return { ...block, content: localizedContent };
          }
          return block;
        })
      );
      onTranslate(localizedBlocks);
    } catch (error) {
      console.error('Localization failed:', error);
    } finally {
      setShowCultures(false);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDetectLanguage}
        disabled={isTranslating}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {detectedLanguage ? LANGUAGES[detectedLanguage] : 'Detect Language'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLanguages(!showLanguages)}
        disabled={isTranslating}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
        </svg>
        Translate
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCultures(!showCultures)}
        disabled={isTranslating}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 mr-2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Localize
      </Button>

      {showLanguages && (
        <Card className="absolute top-full left-0 mt-1 p-2 w-48 z-50 grid grid-cols-2 gap-1">
          {Object.entries(LANGUAGES).map(([code, name]) => (
            <Button
              key={code}
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => handleTranslate(code as Language)}
              disabled={isTranslating || code === detectedLanguage}
            >
              {name}
            </Button>
          ))}
        </Card>
      )}

      {showCultures && (
        <Card className="absolute top-full left-0 mt-1 p-2 w-64 z-50">
          <div className="space-y-2">
            <div className="font-medium text-sm mb-2">US Market</div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalize('US', 'formal')}
                disabled={isTranslating}
              >
                Formal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalize('US', 'casual')}
                disabled={isTranslating}
              >
                Casual
              </Button>
            </div>

            <div className="font-medium text-sm mb-2">UK Market</div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalize('UK', 'formal')}
                disabled={isTranslating}
              >
                Formal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalize('UK', 'casual')}
                disabled={isTranslating}
              >
                Casual
              </Button>
            </div>

            <div className="font-medium text-sm mb-2">Marketing</div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalize('US', 'marketing')}
                disabled={isTranslating}
              >
                US Style
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalize('UK', 'marketing')}
                disabled={isTranslating}
              >
                UK Style
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isTranslating && (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm text-muted-foreground">Translating...</span>
        </div>
      )}
    </div>
  );
}