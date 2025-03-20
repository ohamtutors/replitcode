import { useCallback } from 'react';

export default function useScrollPosition() {
  const STORAGE_KEY = 'iframeScrollPosition';

  // Save scroll position to localStorage - with fallback for cross-origin restrictions
  const saveScrollPosition = useCallback((contentWindow: Window | null | undefined) => {
    if (!contentWindow) return;
    
    // For cross-origin iframes, we can't access contentWindow properties directly
    // Instead, we'll use sessionStorage in the parent window
    try {
      // Try to access contentWindow.scrollY (will work for same-origin frames)
      const scrollY = contentWindow.scrollY || 0;
      localStorage.setItem(STORAGE_KEY, scrollY.toString());
    } catch (e) {
      // For cross-origin frames, we'll use the last known position or a default
      console.log('Using fallback scroll position storage');
      // We can't access the iframe's scroll position, so we'll use what we have
      const currentPosition = localStorage.getItem(STORAGE_KEY) || '0';
      localStorage.setItem(STORAGE_KEY, currentPosition);
    }
  }, []);

  // Restore scroll position with message passing for cross-origin iframes
  const restoreScrollPosition = useCallback((contentWindow: Window | null | undefined) => {
    if (!contentWindow) return;
    
    const savedPosition = localStorage.getItem(STORAGE_KEY);
    if (!savedPosition) return;
    
    try {
      // Direct access (will work for same-origin frames)
      setTimeout(() => {
        contentWindow.scrollTo(0, parseInt(savedPosition, 10));
      }, 300);
    } catch (e) {
      // For cross-origin frames, we need a different approach
      console.log('Using fallback scroll position restoration');
      
      // We can try to use postMessage (if the iframe content supports it)
      try {
        const scrollData = { type: 'RESTORE_SCROLL', position: parseInt(savedPosition, 10) };
        contentWindow.postMessage(scrollData, '*');
      } catch (msgError) {
        console.warn('Could not send scroll position message', msgError);
      }
    }
  }, []);

  // Clear the saved scroll position
  const clearScrollPosition = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { saveScrollPosition, restoreScrollPosition, clearScrollPosition };
}
