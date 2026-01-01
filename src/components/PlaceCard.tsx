import { Place } from '@/types/novel';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  return (
    <Link to={`/place/${place.id}`}>
      <Card className="card-interactive overflow-hidden animate-slide-up">
        <div className="flex gap-3 p-3">
          <div className="w-12 h-12 bg-accent/20 rounded-lg shrink-0 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-semibold leading-tight truncate">
              {place.name}
            </h4>
            {place.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {place.description}
              </p>
            )}
            {place.linkedCharacterIds.length > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-link">
                <Users className="w-3 h-3" />
                <span>{place.linkedCharacterIds.length} characters</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PlaceCard;
