'use client';

import { useEffect, useState } from 'react';
import { usePresentationStore, type Presentation } from '@/store/presentationStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toasts } from '@/components/ui/toast-wrapper';
import { Loader2, Eye, Pencil, Share2, Trash2, FileText, Presentation as PresentationIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';

export default function MyPresentations() {
  const { presentations, isLoading, error, fetchPresentations, deletePresentation, generateShareLink } = usePresentationStore();
  const [mounted, setMounted] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [sharingId, setSharingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchPresentations();
  }, [fetchPresentations]);

  const handleViewPresentation = (id: string) => {
    router.push(`/presentation-viewer/${id}`);
  };

  const handleEditPresentation = (id: string) => {
    router.push(`/edit-presentation/${id}`);
  };

  const handleSharePresentation = async (id: string) => {
    try {
      setSharingId(id);
      const link = await generateShareLink(id, 24); // 24 hours expiry
      setShareLink(link);
      setShareDialogOpen(true);
    } catch (error) {
      console.error('Error generating share link:', error);
      toasts.error('Failed to generate share link');
    } finally {
      setSharingId(null);
    }
  };

  const handleDeletePresentation = async (id: string) => {
    try {
      setIsDeleting(true);
      await deletePresentation(id);
      toasts.success('Presentation deleted successfully');
      setPresentationToDelete(null);
    } catch (error) {
      console.error('Error deleting presentation:', error);
      toasts.error('Failed to delete presentation');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toasts.success('Share link copied to clipboard!');
  };

  if (!mounted) return null;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Presentations</h1>
          <p className="text-muted-foreground mt-2">
            Access, edit and share your saved presentations
          </p>
        </div>
        <Button onClick={() => router.push('/tools/presentation-generator')}>
          <PresentationIcon className="mr-2 h-4 w-4" />
          Create New Presentation
        </Button>
      </div>

      {isLoading && !presentations.length ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          <p>Error loading presentations: {error}</p>
        </div>
      ) : !presentations.length ? (
        <div className="bg-muted p-12 rounded-md flex flex-col items-center justify-center text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No presentations yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't created any presentations yet. Create your first one to see it here.
          </p>
          <Button onClick={() => router.push('/tools/presentation-generator')}>
            Create Your First Presentation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map((presentation) => (
            <Card key={presentation.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1" title={presentation.title}>
                  {presentation.title}
                </CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(presentation.createdAt), { addSuffix: true })}
                  {' • '}
                  {presentation.slideCount} slides
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-0">
                <div className="bg-muted rounded-md p-3 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <PresentationIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {presentation.type === 'general' ? 'General Presentation' : 'Proposal'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-4 grid grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleViewPresentation(presentation.id)}
                  title="View"
                >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                  size="icon" 
                  onClick={() => handleEditPresentation(presentation.id)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                    </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleSharePresentation(presentation.id)}
                  disabled={sharingId === presentation.id}
                  title="Share"
                >
                  {sharingId === presentation.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                    </Button>
                    <Button
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPresentationToDelete(presentation.id)}
                  className="text-destructive hover:text-destructive"
                  title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
              </CardFooter>
            </Card>
              ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Presentation</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your presentation for the next 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 p-2 border rounded-md"
            />
            <Button onClick={copyShareLink} variant="secondary">
              Copy
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!presentationToDelete} onOpenChange={(open) => !open && setPresentationToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Presentation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this presentation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setPresentationToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => presentationToDelete && handleDeletePresentation(presentationToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
