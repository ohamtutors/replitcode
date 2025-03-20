import { useEffect } from 'react';
import AppShell from '@/components/AppShell';

export default function Home() {
  // Set meta viewport to prevent zooming and scaling
  useEffect(() => {
    // Set the meta viewport tag for mobile
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
    
    // Prevent default touch behavior on the body
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.target && (e.target as HTMLElement).tagName !== 'IFRAME') {
        e.preventDefault();
      }
    };
    
    document.body.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    
    return () => {
      document.body.removeEventListener('touchmove', preventPullToRefresh);
    };
  }, []);

  return <AppShell />;
}
