import { Novel } from '@/types/novel';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BookOpen, Users, MapPin, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface NovelCardProps {
  novel: Novel;
}

const NovelCard = ({ novel }: NovelCardProps) => {
  const { getNovelCharacters, getNovelPlaces, getNovelNotes } = useApp();
  
  const characterCount = getNovelCharacters(novel.id).length;
  const placeCount = getNovelPlaces(novel.id).length;
  const noteCount = getNovelNotes(novel.id).length;

  return (
    <Link to={`/novel/${novel.id}`}>
      <Card className="card-interactive overflow-hidden animate-fade-in">
        <div className="flex gap-4 p-4">
          {novel.coverImage ? (
            <img
              src={novel.coverImage}
              alt={novel.title}
              className="w-20 h-28 object-cover rounded-md shrink-0 bg-muted"
            />
          ) : (
            <div className="w-20 h-28 bg-secondary rounded-md shrink-0 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg leading-tight mb-1 truncate">
              {novel.title}
            </h3>
            {novel.author && (
              <p className="text-sm text-muted-foreground mb-2">by {novel.author}</p>
            )}
            {novel.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {novel.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {characterCount}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {placeCount}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {noteCount}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default NovelCard;
