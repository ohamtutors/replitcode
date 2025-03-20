import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center font-medium">
      <WifiOff className="inline-block mr-1 h-4 w-4" />
      You're offline. Some features may be unavailable.
    </div>
  );
}
