import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import LinkBadge from '@/components/LinkBadge';
import LinkDialog from '@/components/dialogs/LinkDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapPin, MoreVertical, Trash2, Link, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';

const PlaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlace, getCharacter, updatePlace, deletePlace, linkCharacterToPlace, unlinkCharacterFromPlace } = useApp();
  
  const place = getPlace(id!);
  const [isEditing, setIsEditing] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Edit state
  const [name, setName] = useState(place?.name || '');
  const [description, setDescription] = useState(place?.description || '');

  if (!place) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Not Found" showBack />
        <main className="page-container">
          <EmptyState
            icon={MapPin}
            title="Place not found"
            description="This place may have been deleted"
            action={
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            }
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  const linkedCharacters = place.linkedCharacterIds
    .map(charId => getCharacter(charId))
    .filter(Boolean);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    updatePlace(id!, {
      name: name.trim(),
      description: description.trim() || undefined,
    });

    setIsEditing(false);
    toast.success('Place updated');
  };

  const handleDelete = () => {
    deletePlace(id!);
    toast.success('Place deleted');
    navigate(-1);
  };

  const handleLink = (characterId: string) => {
    linkCharacterToPlace(characterId, id!);
  };

  const handleUnlink = (characterId: string) => {
    unlinkCharacterFromPlace(characterId, id!);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={isEditing ? 'Edit Place' : place.name}
        showBack
        rightAction={
          isEditing ? (
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Place
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLinkDialog(true)}>
                  <Link className="w-4 h-4 mr-2" />
                  Link Characters
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Place
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />

      <main className="page-container animate-fade-in">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Place name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this place..."
                rows={6}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setName(place.name);
                setDescription(place.description || '');
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Icon */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold">{place.name}</h2>
              </div>
            </div>

            {place.description && (
              <div>
                <h3 className="font-serif font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{place.description}</p>
              </div>
            )}

            {/* Linked Characters */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-semibold">Characters at this Place</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLinkDialog(true)}
                >
                  <Link className="w-4 h-4 mr-1" />
                  Link
                </Button>
              </div>
              {linkedCharacters.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {linkedCharacters.map(char => (
                    <LinkBadge
                      key={char!.id}
                      type="character"
                      id={char!.id}
                      name={char!.name}
                      onRemove={() => handleUnlink(char!.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No linked characters</p>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      <LinkDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        novelId={place.novelId}
        type="place"
        currentId={id!}
        linkedIds={place.linkedCharacterIds}
        onLink={handleLink}
        onUnlink={handleUnlink}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Place?"
        description="This will permanently delete this place and all its links. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
};

export default PlaceDetail;
