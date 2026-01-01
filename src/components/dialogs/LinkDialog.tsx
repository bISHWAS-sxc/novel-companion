import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Search, User, MapPin, Check } from 'lucide-react';
import { Character, Place } from '@/types/novel';

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  novelId: string;
  type: 'character' | 'place';
  currentId: string;
  linkedIds: string[];
  onLink: (id: string) => void;
  onUnlink: (id: string) => void;
}

const LinkDialog = ({
  open,
  onOpenChange,
  novelId,
  type,
  currentId,
  linkedIds,
  onLink,
  onUnlink,
}: LinkDialogProps) => {
  const { getNovelCharacters, getNovelPlaces } = useApp();
  const [search, setSearch] = useState('');

  const items = type === 'place'
    ? getNovelCharacters(novelId)
    : getNovelPlaces(novelId);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (itemId: string) => {
    if (linkedIds.includes(itemId)) {
      onUnlink(itemId);
      toast.success('Link removed');
    } else {
      onLink(itemId);
      toast.success('Link added');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-serif">
            Link {type === 'place' ? 'Characters' : 'Places'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${type === 'place' ? 'characters' : 'places'}...`}
              className="pl-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No {type === 'place' ? 'characters' : 'places'} found
              </p>
            ) : (
              filteredItems.map(item => {
                const isLinked = linkedIds.includes(item.id);
                const Icon = type === 'place' ? User : MapPin;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isLinked
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-left font-medium">{item.name}</span>
                    {isLinked && (
                      <Check className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
