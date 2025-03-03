import React, { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { CollaborationSession } from '../../types/documents';

interface CollaborationPanelProps {
  documentId: string;
  currentUserId: string;
  onClose: () => void;
  onInviteCollaborator: (email: string, permission: 'view' | 'comment' | 'edit') => Promise<void>;
}

export function CollaborationPanel({
  documentId,
  currentUserId,
  onClose,
  onInviteCollaborator
}: CollaborationPanelProps) {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState<'view' | 'comment' | 'edit'>('view');
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'collaborators' | 'history'>('collaborators');
  
  // Mock data for demonstration
  const mockCollaborators = [
    { id: '1', name: 'Jane Smith', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', role: 'Owner' },
    { id: '2', name: 'John Doe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', role: 'Editor' },
    { id: '3', name: 'Alice Johnson', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', role: 'Viewer' }
  ];
  
  const mockHistory = [
    { timestamp: new Date(Date.now() - 1000 * 60 * 5), user: 'Jane Smith', action: 'edited section "Introduction"' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 15), user: 'John Doe', action: 'added chart' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 30), user: 'Alice Johnson', action: 'commented on paragraph 3' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 60), user: 'Jane Smith', action: 'created document' }
  ];

  useEffect(() => {
    // Here we would fetch the collaboration session from an API
    // For now, let's use mock data
    const mockSession: CollaborationSession = {
      id: 'session-1',
      documentId,
      participants: mockCollaborators.map(c => ({
        id: c.id,
        name: c.name,
        avatarUrl: c.avatarUrl,
        cursorPosition: undefined,
        lastActive: new Date()
      })),
      startedAt: new Date(),
      isActive: true
    };
    
    setSession(mockSession);

    // In a real app, we would establish a WebSocket connection here
    const mockConnectionInterval = setInterval(() => {
      // Simulate cursor movement updates
      setSession(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          participants: prev.participants.map(p => ({
            ...p,
            lastActive: p.id !== currentUserId ? new Date() : p.lastActive,
            cursorPosition: p.id !== currentUserId ? {
              blockId: `block-${Math.floor(Math.random() * 5) + 1}`,
              offset: Math.floor(Math.random() * 100)
            } : p.cursorPosition
          }))
        };
      });
    }, 5000);

    return () => clearInterval(mockConnectionInterval);
  }, [documentId, currentUserId]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      setError('Email is required');
      return;
    }

    setError(null);
    setIsInviting(true);
    
    try {
      await onInviteCollaborator(inviteEmail, invitePermission);
      setInviteEmail('');
      // In a real app, we would update the session with the new collaborator
    } catch (err) {
      setError('Failed to invite collaborator');
    } finally {
      setIsInviting(false);
    }
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (!session) {
    return (
      <Card className="p-4 w-72 border-l h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Collaboration</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-72 border-l overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Collaboration</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4">
        <Button 
          variant={activeTab === 'collaborators' ? 'default' : 'outline'}
          size="sm" 
          className="flex-1"
          onClick={() => setActiveTab('collaborators')}
        >
          Collaborators
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'default' : 'outline'} 
          size="sm" 
          className="flex-1"
          onClick={() => setActiveTab('history')}
        >
          History
        </Button>
      </div>

      {/* Collaborators tab */}
      {activeTab === 'collaborators' && (
        <div className="space-y-4">
          {/* Invite form */}
          <div className="space-y-2">
            <div className="text-sm font-medium mb-1">Invite people</div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-1 text-sm border rounded-md"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <select 
                className="px-2 py-1 text-sm border rounded-md bg-background" 
                value={invitePermission} 
                onChange={(e) => setInvitePermission(e.target.value as any)}
              >
                <option value="view">View</option>
                <option value="comment">Comment</option>
                <option value="edit">Edit</option>
              </select>
            </div>
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button 
              size="sm"
              className="w-full"
              disabled={isInviting}
              onClick={handleInvite}
            >
              {isInviting ? (
                <span className="flex items-center gap-2">
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
                  Inviting...
                </span>
              ) : (
                'Send Invite'
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">People with access</div>
            <ul className="space-y-2">
              {mockCollaborators.map((collaborator) => (
                <li key={collaborator.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full overflow-hidden border mr-2 relative"
                      title={collaborator.name}
                    >
                      <img 
                        src={collaborator.avatarUrl} 
                        alt={collaborator.name}
                        className="w-full h-full object-cover"
                      />
                      {session.participants.find(p => p.id === collaborator.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="truncate max-w-[120px]">
                      <div className="text-sm font-medium">{collaborator.name}</div>
                      <div className="text-xs text-muted-foreground">{collaborator.role}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    disabled={collaborator.id === currentUserId}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 12v.01M12 16v.01M12 8v.01M12 4v.01" />
                    </svg>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Active now</div>
            <ul className="space-y-2">
              {session.participants
                .filter(p => {
                  const lastActiveTime = new Date(p.lastActive).getTime();
                  const now = Date.now();
                  return now - lastActiveTime < 1000 * 60 * 5; // Active in the last 5 minutes
                })
                .map((participant) => (
                  <li 
                    key={participant.id} 
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden border mr-2">
                        <img 
                          src={participant.avatarUrl} 
                          alt={participant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {participant.name}
                          {participant.id === currentUserId && " (you)"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {participant.cursorPosition
                            ? `Editing block ${participant.cursorPosition.blockId.replace('block-', '')}`
                            : 'Viewing'
                          }
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="text-sm font-medium">Recent changes</div>
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {mockHistory.map((entry, index) => (
              <li key={index} className="relative pl-5 pb-3 border-l border-muted">
                <div className="absolute w-2 h-2 rounded-full bg-primary -left-[4.5px]" />
                <div className="text-xs text-muted-foreground">
                  {formatTime(entry.timestamp)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">{entry.user}</span> {entry.action}
                </div>
              </li>
            ))}
          </ul>

          <Button variant="outline" size="sm" className="w-full">
            View full history
          </Button>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Document ID: {documentId.substring(0, 8)}
        </div>
        <div className="mt-2 flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1 h-8">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy Link
          </Button>
          <Button variant="outline" size="sm" className="flex-1 h-8">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Export
          </Button>
        </div>
      </div>
    </Card>
  );
}