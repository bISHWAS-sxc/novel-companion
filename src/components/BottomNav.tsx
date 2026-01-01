import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Settings } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive('/') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs mt-1 font-medium">Library</span>
        </Link>
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1 font-medium">Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
