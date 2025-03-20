import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage';
import useScrollPosition from '@/hooks/useScrollPosition';

interface ContentFrameProps {
  src: string;
  refreshTrigger: number;
}

export default function ContentFrame({ src, refreshTrigger }: ContentFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  
  // Load timeout reference
  const loadTimeoutRef = useRef<number | null>(null);
  
  // Effect to handle iframe loading and error states
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      window.clearTimeout(loadTimeoutRef.current);
    }
    
    // Set timeout for loading (15 seconds)
    loadTimeoutRef.current = window.setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
        toast({
          title: "Loading timeout",
          description: "Content took too long to load. Please try again.",
          variant: "destructive",
        });
      }
    }, 15000);
    
    // Listen for messages from the iframe (for cross-origin communication)
    const handleIframeMessage = (event: MessageEvent) => {
      // We'll accept messages from the Google Apps Script domain
      // This is less restrictive but necessary for cross-origin communication
      
      // Handle scroll position message from iframe content (if implemented)
      if (event.data && event.data.type === 'SAVE_SCROLL') {
        const position = event.data.position;
        if (typeof position === 'number') {
          localStorage.setItem('iframeScrollPosition', position.toString());
        }
      }
    };
    
    window.addEventListener('message', handleIframeMessage);
    
    return () => {
      if (loadTimeoutRef.current) {
        window.clearTimeout(loadTimeoutRef.current);
      }
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [refreshTrigger, toast, src]);
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    if (loadTimeoutRef.current) {
      window.clearTimeout(loadTimeoutRef.current);
    }
    
    setIsLoading(false);
    setHasError(false);
    
    // Apply overscroll behavior to iframe content
    try {
      if (iframeRef.current?.contentDocument?.body) {
        iframeRef.current.contentDocument.body.style.overscrollBehavior = 'none';
        iframeRef.current.contentDocument.body.style.touchAction = 'manipulation';
      }
    } catch (e) {
      console.warn('Could not modify iframe content styles', e);
    }
    
    // Restore scroll position
    restoreScrollPosition(iframeRef.current?.contentWindow);
  };
  
  // Handle iframe error
  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };
  
  // Save scroll position when component unmounts or visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveScrollPosition(iframeRef.current?.contentWindow);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      saveScrollPosition(iframeRef.current?.contentWindow);
    };
  }, [saveScrollPosition]);
  
  // Effect to reload the iframe when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0 && iframeRef.current) {
      saveScrollPosition(iframeRef.current.contentWindow);
      iframeRef.current.src = src;
    }
  }, [refreshTrigger, src, saveScrollPosition]);
  
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    
    if (iframeRef.current) {
      // Reload the iframe
      iframeRef.current.src = src;
    }
  };
  
  return (
    <div className="flex-1 relative w-full overflow-hidden">
      {isLoading && <LoadingIndicator />}
      
      {hasError ? (
        <ErrorMessage onRetry={handleRetry} />
      ) : (
        <iframe
          ref={iframeRef}
          title="Web Application Content"
          src={src}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          className={`w-full h-full border-none ${isLoading ? 'hidden' : 'block'}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  );
}
