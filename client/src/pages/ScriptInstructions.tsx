import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Code } from "lucide-react";

export default function ScriptInstructions() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-4 flex items-center"
        onClick={() => setLocation("/")}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to App
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Google Apps Script Integration</CardTitle>
          <CardDescription>
            Instructions for Google Apps Script developers to optimize for this viewer app
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary" />
              Disabling Pull-to-Refresh on Your Script
            </h3>
            <p className="text-sm mb-3">
              To ensure your web app works properly in this viewer, add this code to your HTML:
            </p>
            <div className="bg-zinc-950 text-zinc-100 p-4 rounded-md overflow-x-auto text-sm">
              <pre>{`// In your Google Apps Script HTML file
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    html, body {
      overscroll-behavior-y: none;
      touch-action: manipulation;
      height: 100%;
      margin: 0;
      overflow: auto;
    }
  </style>
</head>
<body>
  <!-- Your content here -->
</body>
</html>`}</pre>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary" />
              Saving Scroll Position
            </h3>
            <p className="text-sm mb-3">
              To enable scroll position saving, add this script to your Apps Script:
            </p>
            <div className="bg-zinc-950 text-zinc-100 p-4 rounded-md overflow-x-auto text-sm">
              <pre>{`<script>
  // Save scroll position
  window.addEventListener('scroll', function() {
    // Throttle the scroll event
    if (!window.scrollPositionThrottle) {
      window.scrollPositionThrottle = setTimeout(function() {
        // Send message to parent window
        window.parent.postMessage({
          type: 'SAVE_SCROLL',
          position: window.scrollY
        }, '*');
        window.scrollPositionThrottle = null;
      }, 200);
    }
  });

  // Listen for scroll position restoration message from parent
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'RESTORE_SCROLL') {
      const position = event.data.position;
      if (typeof position === 'number') {
        window.scrollTo(0, position);
      }
    }
  });
</script>`}</pre>
            </div>
          </section>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            Back to App
          </Button>
          <Button
            variant="default"
            onClick={() => {
              navigator.clipboard.writeText(document.querySelector('pre')?.textContent || '');
              alert('Code copied to clipboard!');
            }}
          >
            Copy Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}