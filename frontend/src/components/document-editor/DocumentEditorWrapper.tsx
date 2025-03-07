import React from 'react';
import { DocumentEditor } from './DocumentEditor';
import { Block, DocumentType } from '../../types/documents';

interface DocumentEditorWrapperProps {
  documentType: DocumentType;
  initialBlocks?: Block[];
  readOnly?: boolean;
}

export function DocumentEditorWrapper(props: DocumentEditorWrapperProps): JSX.Element {
  return (
    <div className="document-editor-wrapper">
      <DocumentEditor {...props} />
    </div>
  );
} 