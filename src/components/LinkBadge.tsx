import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, X } from 'lucide-react';

interface LinkBadgeProps {
  type: 'character' | 'place';
  id: string;
  name: string;
  onRemove?: () => void;
}

const LinkBadge = ({ type, id, name, onRemove }: LinkBadgeProps) => {
  const Icon = type === 'character' ? User : MapPin;
  const path = type === 'character' ? `/character/${id}` : `/place/${id}`;

  return (
    <Badge variant="secondary" className="gap-1 pr-1 group">
      <Link to={path} className="flex items-center gap-1 link-text no-underline">
        <Icon className="w-3 h-3" />
        <span>{name}</span>
      </Link>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </Badge>
  );
};

export default LinkBadge;
