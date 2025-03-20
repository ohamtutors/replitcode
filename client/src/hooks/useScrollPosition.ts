import { useCallback } from 'react';

export default function useScrollPosition() {
  const STORAGE_KEY = 'iframeScrollPosition';

  // Save scroll position to localStorage
  const saveScrollPosition = useCallback((contentWindow: Window | null | undefined) => {
    if (contentWindow) {
      try {
        const scrollY = contentWindow.scrollY || 0;
        localStorage.setItem(STORAGE_KEY, scrollY.toString());
      } catch (e) {
        console.warn('Could not save scroll position', e);
      }
    }
  }, []);

  // Restore scroll position from localStorage
  const restoreScrollPosition = useCallback((contentWindow: Window | null | undefined) => {
    const savedPosition = localStorage.getItem(STORAGE_KEY);
    if (savedPosition && contentWindow) {
      try {
        // Use a small timeout to ensure the iframe has fully loaded its content
        setTimeout(() => {
          contentWindow.scrollTo(0, parseInt(savedPosition, 10));
        }, 100);
      } catch (e) {
        console.warn('Could not restore scroll position', e);
      }
    }
  }, []);

  // Clear the saved scroll position
  const clearScrollPosition = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { saveScrollPosition, restoreScrollPosition, clearScrollPosition };
}
