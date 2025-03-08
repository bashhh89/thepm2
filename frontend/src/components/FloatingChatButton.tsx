import React from 'react';
import { Button } from './Button';
import { ChatWidget } from './ChatWidget';
import { Dialog, DialogTrigger } from './Dialog';

interface FloatingChatButtonProps {
  className?: string;
}

export function FloatingChatButton({ className }: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4" size="lg">
            Chat
          </Button>
        </DialogTrigger>
        <ChatWidget />
      </Dialog>
    </div>
  );
}