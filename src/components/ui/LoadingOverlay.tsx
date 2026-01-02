interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ouija-dark bg-opacity-90">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-ouija-gold border-t-transparent"></div>
        <p className="text-xl text-ouija-gold">{message}</p>
      </div>
    </div>
  );
}
