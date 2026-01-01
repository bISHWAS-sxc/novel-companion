import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import NovelCard from '@/components/NovelCard';
import EmptyState from '@/components/EmptyState';
import AddNovelDialog from '@/components/dialogs/AddNovelDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Plus, Search } from 'lucide-react';

const Index = () => {
  const { data } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [search, setSearch] = useState('');

  const filteredNovels = data.novels.filter(novel =>
    novel.title.toLowerCase().includes(search.toLowerCase()) ||
    novel.author?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNovels = [...filteredNovels].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Novel Library"
        rightAction={
          <Button size="icon" variant="ghost" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        }
      />

      <main className="page-container">
        {data.novels.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search novels..."
              className="pl-9"
            />
          </div>
        )}

        {sortedNovels.length > 0 ? (
          <div className="space-y-3">
            {sortedNovels.map(novel => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        ) : data.novels.length > 0 ? (
          <EmptyState
            icon={Search}
            title="No results"
            description="Try a different search term"
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Your library is empty"
            description="Add your first novel to start tracking characters, places, and important notes"
            action={
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Novel
              </Button>
            }
          />
        )}
      </main>

      <BottomNav />

      <AddNovelDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default Index;
