import React from 'react';
import { Card } from './Card';
import { ChatApplicationForm } from './ChatApplicationForm';

interface ChatApplicationAssistantProps {
  jobId: string;
  jobTitle: string;
  jobDescription?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChatApplicationAssistant({ 
  jobId, 
  jobTitle,
  jobDescription,
  onSuccess,
  onCancel 
}: ChatApplicationAssistantProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-card">
      <ChatApplicationForm
        jobId={jobId}
        jobTitle={jobTitle}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Card>
  );
}