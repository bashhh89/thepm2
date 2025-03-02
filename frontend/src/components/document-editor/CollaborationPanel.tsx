import React, { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { useUser } from '@clerk/clerk-react';

interface CollaborationPanelProps {
  documentId?: string;
}

interface CollaboratorInfo {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle' | 'offline';
  lastActive: Date;
}

export function CollaborationPanel({ documentId }: CollaborationPanelProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!documentId || !user) return;

    // Initialize WebSocket connection for collaboration
    const socket = window.puter.ws.connect(`/documents/${documentId}/collaborate`);

    socket.addEventListener('open', () => {
      // Send user info when connecting
      socket.send(JSON.stringify({
        type: 'join',
        user: {
          id: user.id,
          name: user.fullName,
          avatar: user.imageUrl
        }
      }));
    });

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'collaborators_update':
          setCollaborators(data.collaborators);
          break;
        case 'user_joined':
          setCollaborators(prev => [...prev, data.user]);
          break;
        case 'user_left':
          setCollaborators(prev => prev.filter(c => c.id !== data.userId));
          break;
        case 'user_status':
          setCollaborators(prev => prev.map(c => 
            c.id === data.userId ? { ...c, status: data.status } : c
          ));
          break;
      }
    });

    setWs(socket);

    // Set up pinging to keep connection alive and update status
    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socket.close();
    };
  }, [documentId, user]);

  const handleShareDocument = async () => {
    try {
      // Use Puter.js UI to show share dialog
      const { emails } = await window.puter.ui.showShareDialog({
        title: 'Share Document',
        message: 'Enter email addresses to share with:',
        defaultPermission: 'edit'
      });

      if (emails && emails.length > 0) {
        // Grant access to the document
        await window.puter.fs.share(`/documents/${documentId}.json`, {
          users: emails.map(email => ({ email, permission: 'edit' }))
        });

        // Notify collaborators through WebSocket
        ws?.send(JSON.stringify({
          type: 'share_update',
          sharedWith: emails
        }));
      }
    } catch (error) {
      console.error('Failed to share document:', error);
    }
  };

  return (
    <div className="w-64 border-l p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Collaborators</h3>
          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div
                key={collaborator.id}
                className="flex items-center space-x-2 py-1"
              >
                <div className="relative">
                  {collaborator.avatar ? (
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {collaborator.name[0]}
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
                      {
                        'bg-green-500': collaborator.status === 'active',
                        'bg-yellow-500': collaborator.status === 'idle',
                        'bg-gray-500': collaborator.status === 'offline'
                      }
                    )}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium">{collaborator.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {collaborator.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleShareDocument}
        >
          Share Document
        </Button>

        {collaborators.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No one else is working on this document
          </p>
        )}
      </div>
    </div>
  );
}