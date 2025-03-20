import { Button } from '@/components/ui/button';
import { RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Link } from 'wouter';

interface AppHeaderProps {
  onRefresh: () => void;
}

export default function AppHeader({ onRefresh }: AppHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-md z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Home className="h-5 w-5 mr-2" />
          <h1 className="text-lg font-medium">Google Apps Viewer</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/instructions">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-primary/90 focus:ring-2 focus:ring-white"
              aria-label="Script Integration Instructions"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRefresh}
            className="hover:bg-primary/90 focus:ring-2 focus:ring-white"
            aria-label="Refresh content"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
