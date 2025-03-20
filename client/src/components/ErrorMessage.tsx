import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  onRetry: () => void;
}

export default function ErrorMessage({ onRetry }: ErrorMessageProps) {
  return (
    <div className="absolute inset-0 bg-background flex flex-col items-center justify-center p-6 z-10">
      <AlertCircle className="text-destructive h-16 w-16 mb-4" />
      <h2 className="text-xl font-medium mb-2 text-foreground">Unable to load content</h2>
      <p className="text-muted-foreground text-center mb-6">
        There was a problem loading the application. Please check your connection and try again.
      </p>
      <Button onClick={onRetry} className="px-6">
        Try Again
      </Button>
    </div>
  );
}
