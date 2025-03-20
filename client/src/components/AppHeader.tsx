import { Button } from '@/components/ui/button';
import { RefreshCw, Settings } from 'lucide-react';

interface AppHeaderProps {
  onRefresh: () => void;
}

export default function AppHeader({ onRefresh }: AppHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground shadow-md z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-medium">WebApp Viewer</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRefresh}
            className="hover:bg-primary/90 focus:ring-2 focus:ring-white"
            aria-label="Refresh content"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-primary/90 focus:ring-2 focus:ring-white"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
