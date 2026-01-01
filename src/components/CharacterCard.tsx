import { Character } from '@/types/novel';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { User, MapPin } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard = ({ character }: CharacterCardProps) => {
  const hasImage = character.images.length > 0;

  return (
    <Link to={`/character/${character.id}`}>
      <Card className="card-interactive overflow-hidden animate-slide-up">
        <div className="flex gap-3 p-3">
          {hasImage ? (
            <img
              src={character.images[0]}
              alt={character.name}
              className="w-14 h-14 object-cover rounded-full shrink-0 bg-muted"
            />
          ) : (
            <div className="w-14 h-14 bg-secondary rounded-full shrink-0 flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-semibold leading-tight truncate">
              {character.name}
            </h4>
            {character.aliases && character.aliases.length > 0 && (
              <p className="text-xs text-muted-foreground truncate">
                aka {character.aliases.join(', ')}
              </p>
            )}
            {character.linkedPlaceIds.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-link">
                <MapPin className="w-3 h-3" />
                <span>{character.linkedPlaceIds.length} places</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CharacterCard;
