import { useState, useRef } from 'react';
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
import { User, MoreVertical, Trash2, Link, Save, ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCharacter, getPlace, updateCharacter, deleteCharacter, linkCharacterToPlace, unlinkCharacterFromPlace } = useApp();
  
  const character = getCharacter(id!);
  const [isEditing, setIsEditing] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Edit state
  const [name, setName] = useState(character?.name || '');
  const [aliases, setAliases] = useState(character?.aliases?.join(', ') || '');
  const [description, setDescription] = useState(character?.description || '');
  const [images, setImages] = useState<string[]>(character?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!character) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Not Found" showBack />
        <main className="page-container">
          <EmptyState
            icon={User}
            title="Character not found"
            description="This character may have been deleted"
            action={
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            }
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  const linkedPlaces = character.linkedPlaceIds
    .map(placeId => getPlace(placeId))
    .filter(Boolean);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    updateCharacter(id!, {
      name: name.trim(),
      aliases: aliases.trim() ? aliases.split(',').map(a => a.trim()).filter(Boolean) : [],
      description: description.trim() || undefined,
      images,
    });

    setIsEditing(false);
    toast.success('Character updated');
  };

  const handleDelete = () => {
    deleteCharacter(id!);
    toast.success('Character deleted');
    navigate(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const handleLink = (placeId: string) => {
    linkCharacterToPlace(id!, placeId);
  };

  const handleUnlink = (placeId: string) => {
    unlinkCharacterFromPlace(id!, placeId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={isEditing ? 'Edit Character' : character.name}
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
                  <User className="w-4 h-4 mr-2" />
                  Edit Character
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLinkDialog(true)}>
                  <Link className="w-4 h-4 mr-2" />
                  Link Places
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Character
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
                placeholder="Character name"
              />
            </div>
            <div className="space-y-2">
              <Label>Aliases (comma separated)</Label>
              <Input
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="Nickname, Title, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Character description..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Images</Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Add Images
              </Button>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setName(character.name);
                setAliases(character.aliases?.join(', ') || '');
                setDescription(character.description || '');
                setImages(character.images);
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Gallery */}
            {character.images.length > 0 && (
              <div className="relative">
                <img
                  src={character.images[currentImageIndex]}
                  alt={character.name}
                  className="w-full h-64 object-cover rounded-xl shadow-card"
                />
                {character.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(i => i > 0 ? i - 1 : character.images.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(i => i < character.images.length - 1 ? i + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {character.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold">{character.name}</h2>
              {character.aliases && character.aliases.length > 0 && (
                <p className="text-muted-foreground mt-1">
                  Also known as: {character.aliases.join(', ')}
                </p>
              )}
            </div>

            {character.description && (
              <div>
                <h3 className="font-serif font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{character.description}</p>
              </div>
            )}

            {/* Linked Places */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-semibold">Linked Places</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLinkDialog(true)}
                >
                  <Link className="w-4 h-4 mr-1" />
                  Link
                </Button>
              </div>
              {linkedPlaces.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {linkedPlaces.map(place => (
                    <LinkBadge
                      key={place!.id}
                      type="place"
                      id={place!.id}
                      name={place!.name}
                      onRemove={() => handleUnlink(place!.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No linked places</p>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      <LinkDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        novelId={character.novelId}
        type="character"
        currentId={id!}
        linkedIds={character.linkedPlaceIds}
        onLink={handleLink}
        onUnlink={handleUnlink}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Character?"
        description="This will permanently delete this character and all its links. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
};

export default CharacterDetail;
