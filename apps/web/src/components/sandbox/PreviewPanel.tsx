'use client';

import { useState } from 'react';
import { RefreshCw, ExternalLink, Monitor, Tablet, Smartphone } from 'lucide-react';

export function PreviewPanel() {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="flex h-full flex-col bg-secondary">
      {/* Barre d'outils */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-md p-1.5 hover:bg-accent transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            className="rounded-md p-1.5 hover:bg-accent transition-colors"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`rounded p-1.5 transition-colors ${
              viewMode === 'desktop' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
            title="Vue Desktop"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`rounded p-1.5 transition-colors ${
              viewMode === 'tablet' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
            title="Vue Tablette"
          >
            <Tablet className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`rounded p-1.5 transition-colors ${
              viewMode === 'mobile' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            }`}
            title="Vue Mobile"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        <div className="text-xs text-muted-foreground">localhost:5173</div>
      </div>

      {/* Iframe de prévisualisation */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: viewportWidths[viewMode], maxWidth: '100%' }}
        >
          <iframe
            src="/sandbox/preview"
            className="h-full w-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
