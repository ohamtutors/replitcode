import { useState, useEffect } from 'react';
import ContentFrame from '@/components/ContentFrame';
import OfflineIndicator from '@/components/OfflineIndicator';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { useLocation } from 'wouter';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Storage key for the Apps Script URL
const SCRIPT_URL_KEY = 'googleAppsScriptUrl';

// Default Google Apps Script URL
const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyYlc4WWmOQU3sgi6idhUGALzRwe1smtndnlL8MDehVaxSi1xJyci1Z9kT2rV5ZrjBI/exec';

export default function AppShell() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isOffline = useNetworkStatus();
  const [location] = useLocation();
  
  // State for the iframe source URL
  const [scriptUrl, setScriptUrl] = useState(() => {
    // Try to get stored URL from localStorage, or use default
    return localStorage.getItem(SCRIPT_URL_KEY) || DEFAULT_SCRIPT_URL;
  });
  
  // State for settings dialog
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(scriptUrl);
  
  // Function to trigger a refresh of the iframe content
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Function to open settings dialog
  const openSettings = () => {
    setTempUrl(scriptUrl);
    setSettingsOpen(true);
  };
  
  // Function to save settings
  const saveSettings = () => {
    try {
      // Basic URL validation
      new URL(tempUrl);
      
      // Save to localStorage and update state
      localStorage.setItem(SCRIPT_URL_KEY, tempUrl);
      setScriptUrl(tempUrl);
      setSettingsOpen(false);
      
      // Refresh the iframe to load new URL
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "Settings Saved",
        description: "Your Google Apps Script URL has been updated.",
      });
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
    }
  };
  
  // Reset to default URL
  const resetToDefault = () => {
    setTempUrl(DEFAULT_SCRIPT_URL);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground" style={{ overscrollBehavior: 'none' }}>
      {/* Only show critical offline indicator when needed */}
      {isOffline && <OfflineIndicator />}
      
      {/* Only show ContentFrame on the home route */}
      {location === '/' && (
        <div className="flex-1 relative">
          {/* Main content area with iframe - full screen */}
          <ContentFrame 
            src={scriptUrl} 
            refreshTrigger={refreshTrigger}
          />
          
          {/* Minimal floating controls - only settings button */}
          <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={openSettings}
              className="rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
              aria-label="Configure Google Apps Script URL"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Google Apps Script Settings</DialogTitle>
            <DialogDescription>
              Enter the URL of your Google Apps Script web app deployment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Make sure your script is deployed as a web app and is accessible to anyone.
            </p>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={resetToDefault}>
              Reset to Default
            </Button>
            <Button onClick={saveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
