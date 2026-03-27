export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">📵</div>
        <h1 className="text-2xl font-bold mb-3">Arey! Net nahi hai</h1>
        <p className="text-text-secondary mb-6">
          You're offline. Check your internet connection and try again. indlish will be waiting! 🙏
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
        <p className="text-text-muted text-sm mt-4">
          Previously visited pages might still load from cache.
        </p>
      </div>
    </div>
  );
}
