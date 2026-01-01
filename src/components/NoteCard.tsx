import { Note } from '@/types/novel';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const linkedCount = note.linkedCharacterIds.length + note.linkedPlaceIds.length;

  return (
    <Link to={`/note/${note.id}`}>
      <Card className="card-interactive overflow-hidden animate-slide-up">
        <div className="flex gap-3 p-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg shrink-0 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium leading-tight truncate">{note.title}</h4>
            {note.content && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {note.content}
              </p>
            )}
            {linkedCount > 0 && (
              <p className="text-xs text-link mt-1">
                {linkedCount} linked items
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default NoteCard;
