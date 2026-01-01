import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CharacterCard from '@/components/CharacterCard';
import PlaceCard from '@/components/PlaceCard';
import NoteCard from '@/components/NoteCard';
import EmptyState from '@/components/EmptyState';
import AddCharacterDialog from '@/components/dialogs/AddCharacterDialog';
import AddPlaceDialog from '@/components/dialogs/AddPlaceDialog';
import AddNoteDialog from '@/components/dialogs/AddNoteDialog';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Users, MapPin, FileText, MoreVertical, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const NovelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNovel, getNovelCharacters, getNovelPlaces, getNovelNotes, deleteNovel } = useApp();
  
  const [activeTab, setActiveTab] = useState('characters');
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const novel = getNovel(id!);
  const characters = getNovelCharacters(id!);
  const places = getNovelPlaces(id!);
  const notes = getNovelNotes(id!);

  if (!novel) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Not Found" showBack />
        <main className="page-container">
          <EmptyState
            icon={FileText}
            title="Novel not found"
            description="This novel may have been deleted"
            action={
              <Button onClick={() => navigate('/')}>Go to Library</Button>
            }
          />
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleDelete = () => {
    deleteNovel(id!);
    toast.success('Novel deleted');
    navigate('/');
  };

  const handleAddClick = () => {
    switch (activeTab) {
      case 'characters':
        setShowAddCharacter(true);
        break;
      case 'places':
        setShowAddPlace(true);
        break;
      case 'notes':
        setShowAddNote(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={novel.title}
        showBack
        rightAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/novel/${id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Novel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Novel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <main className="px-4 pb-24">
        {/* Novel Header */}
        <div className="flex gap-4 py-4">
          {novel.coverImage ? (
            <img
              src={novel.coverImage}
              alt={novel.title}
              className="w-24 h-32 object-cover rounded-lg shrink-0 shadow-card"
            />
          ) : null}
          <div className="flex-1 min-w-0">
            {novel.author && (
              <p className="text-sm text-muted-foreground mb-1">by {novel.author}</p>
            )}
            {novel.description && (
              <p className="text-sm text-muted-foreground line-clamp-4">{novel.description}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="characters" className="gap-1.5">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Characters</span>
              <span className="text-xs">({characters.length})</span>
            </TabsTrigger>
            <TabsTrigger value="places" className="gap-1.5">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Places</span>
              <span className="text-xs">({places.length})</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
              <span className="text-xs">({notes.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters" className="mt-4 space-y-2">
            {characters.length > 0 ? (
              characters.map(character => (
                <CharacterCard key={character.id} character={character} />
              ))
            ) : (
              <EmptyState
                icon={Users}
                title="No characters yet"
                description="Add characters to track their details and relationships"
                action={
                  <Button onClick={() => setShowAddCharacter(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Character
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="places" className="mt-4 space-y-2">
            {places.length > 0 ? (
              places.map(place => (
                <PlaceCard key={place.id} place={place} />
              ))
            ) : (
              <EmptyState
                icon={MapPin}
                title="No places yet"
                description="Add locations from the novel to track and link with characters"
                action={
                  <Button onClick={() => setShowAddPlace(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Place
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-4 space-y-2">
            {notes.length > 0 ? (
              notes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))
            ) : (
              <EmptyState
                icon={FileText}
                title="No notes yet"
                description="Add important notes, plot points, or reminders"
                action={
                  <Button onClick={() => setShowAddNote(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* FAB */}
      <Button
        onClick={handleAddClick}
        className="fab bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <BottomNav />

      {/* Dialogs */}
      <AddCharacterDialog
        open={showAddCharacter}
        onOpenChange={setShowAddCharacter}
        novelId={id!}
      />
      <AddPlaceDialog
        open={showAddPlace}
        onOpenChange={setShowAddPlace}
        novelId={id!}
      />
      <AddNoteDialog
        open={showAddNote}
        onOpenChange={setShowAddNote}
        novelId={id!}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Novel?"
        description="This will permanently delete this novel and all its characters, places, and notes. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
};

export default NovelDetail;
