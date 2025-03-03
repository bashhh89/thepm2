import React, { useState } from 'react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Block, DocumentType } from '../../types/documents';

interface DocumentToolbarProps {
  documentType: DocumentType;
  onSave: () => void;
  onAddBlock: (type: Block['type']) => void;
  onGenerateContent: () => void;
  onToggleCollaboration: () => void;
  showCollaboration: boolean;
  translationToolbar?: React.ReactNode;
}

export function DocumentToolbar({
  documentType = 'document',
  onSave,
  onAddBlock,
  onGenerateContent,
  onToggleCollaboration,
  showCollaboration,
  translationToolbar
}: DocumentToolbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const blockOptions = [
    { type: 'text' as const, label: 'Text Block', icon: 'text' },
    { type: 'image' as const, label: 'Image', icon: 'image' },
    { type: 'chart' as const, label: 'Chart', icon: 'chart' },
    { type: 'data' as const, label: 'Table', icon: 'table' }
  ];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'add':
        return <path d="M12 5v14M5 12h14" />;
      case 'collaborate':
        return (
          <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        );
      case 'save':
        return (
          <>
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </>
        );
      case 'text':
        return (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </>
        );
      case 'image':
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </>
        );
      case 'chart':
        return (
          <>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </>
        );
      case 'table':
        return (
          <>
            <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="15" y2="16" />
          </>
        );
      default:
        return null;
    }
  };

  const handleMenuToggle = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleAction = (type: Block['type']) => {
    onAddBlock(type);
    setActiveMenu(null);
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-4">
        {/* Left section */}
        <div className="flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {renderIcon('text')}
          </svg>
          <span className="capitalize">{documentType}</span>
        </div>

        <div className="h-6 border-l" />

        {/* Center section */}
        <div className="flex flex-1 items-center justify-start gap-2">
          {/* Add Block Button */}
          <div className="relative">
            <Button
              size="sm"
              variant={activeMenu === 'add' ? 'secondary' : 'ghost'}
              onClick={() => handleMenuToggle('add')}
              className="gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {renderIcon('add')}
              </svg>
              Add
            </Button>
            {activeMenu === 'add' && (
              <Card className="absolute top-full left-0 mt-1 w-[160px] p-1 shadow-lg z-50">
                {blockOptions.map((option) => (
                  <button
                    key={option.type}
                    className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent flex items-center gap-2"
                    onClick={() => handleAction(option.type)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {renderIcon(option.icon)}
                    </svg>
                    {option.label}
                  </button>
                ))}
              </Card>
            )}
          </div>

          {/* Collaborate Button */}
          <Button
            size="sm"
            variant={showCollaboration ? 'secondary' : 'ghost'}
            onClick={onToggleCollaboration}
            className="gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {renderIcon('collaborate')}
            </svg>
            Collaborate
          </Button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Translation Tools */}
          {translationToolbar}

          {/* Save Button */}
          <Button
            size="sm"
            onClick={onSave}
            className="gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {renderIcon('save')}
            </svg>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}