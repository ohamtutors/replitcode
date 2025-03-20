export default function LoadingIndicator() {
  return (
    <div className="absolute inset-0 bg-background bg-opacity-80 z-20 flex flex-col items-center justify-center">
      <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-6 text-muted-foreground">Loading content...</p>
    </div>
  );
}
