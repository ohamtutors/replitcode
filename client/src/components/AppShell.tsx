import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import ContentFrame from '@/components/ContentFrame';
import OfflineIndicator from '@/components/OfflineIndicator';
import useNetworkStatus from '@/hooks/useNetworkStatus';

export default function AppShell() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isOffline = useNetworkStatus();
  
  // Function to trigger a refresh of the iframe content
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground" style={{ overscrollBehavior: 'none' }}>
      <AppHeader onRefresh={handleRefresh} />
      
      {isOffline && <OfflineIndicator />}
      
      <ContentFrame 
        src={import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/your-script-id/exec"} 
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
