import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import LinkBadge from '@/components/LinkBadge';
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
import { FileText, MoreVertical, Trash2, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';

const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNote, getCharacter, getPlace, updateNote, deleteNote } = useApp();
  
  const note = getNote(id!);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Edit state
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  if (!note) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Not Found" showBack />
        <main className="page-container">
          <EmptyState
            icon={FileText}
            title="Note not found"
            description="This note may have been deleted"
            action={
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            }
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  const linkedCharacters = note.linkedCharacterIds
    .map(charId => getCharacter(charId))
    .filter(Boolean);

  const linkedPlaces = note.linkedPlaceIds
    .map(placeId => getPlace(placeId))
    .filter(Boolean);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    updateNote(id!, {
      title: title.trim(),
      content: content.trim(),
    });

    setIsEditing(false);
    toast.success('Note updated');
  };

  const handleDelete = () => {
    deleteNote(id!);
    toast.success('Note deleted');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={isEditing ? 'Edit Note' : note.title}
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
                  Edit Note
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Note
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
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                rows={12}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setTitle(note.title);
                setContent(note.content);
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
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">{note.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {note.content && (
              <div className="bg-card rounded-lg p-4 shadow-soft">
                <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
              </div>
            )}

            {/* Linked Items */}
            {(linkedCharacters.length > 0 || linkedPlaces.length > 0) && (
              <div>
                <h3 className="font-serif font-semibold mb-2">Linked Items</h3>
                <div className="flex flex-wrap gap-2">
                  {linkedCharacters.map(char => (
                    <LinkBadge
                      key={char!.id}
                      type="character"
                      id={char!.id}
                      name={char!.name}
                    />
                  ))}
                  {linkedPlaces.map(place => (
                    <LinkBadge
                      key={place!.id}
                      type="place"
                      id={place!.id}
                      name={place!.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Note?"
        description="This will permanently delete this note. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
};

export default NoteDetail;
