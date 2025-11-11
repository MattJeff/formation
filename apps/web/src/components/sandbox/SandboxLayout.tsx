'use client';

import { useState } from 'react';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { ClientPanel } from './ClientPanel';
import { Terminal } from './Terminal';
import { PreviewPanel } from './PreviewPanel';
import { ActivityBar } from './ActivityBar';

export function SandboxLayout() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(350);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(250);
  const [activeLeftTab, setActiveLeftTab] = useState<'files' | 'search' | 'git' | 'terminal'>(
    'files'
  );
  const [activeBottomTab, setActiveBottomTab] = useState<'preview' | 'terminal' | 'console'>(
    'preview'
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Activity Bar (Barre verticale gauche) */}
      <ActivityBar activeTab={activeLeftTab} onTabChange={setActiveLeftTab} />

      {/* Panneau Gauche - Explorateur & Outils */}
      <div
        className="flex flex-col border-r border-border bg-card"
        style={{ width: `${leftPanelWidth}px` }}
      >
        <div className="flex-1 overflow-auto">
          {activeLeftTab === 'files' && <FileExplorer />}
          {activeLeftTab === 'search' && (
            <div className="p-4">
              <h3 className="mb-2 font-semibold">Recherche</h3>
              <input
                type="text"
                placeholder="Rechercher dans les fichiers..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
          {activeLeftTab === 'git' && (
            <div className="p-4">
              <h3 className="mb-2 font-semibold">Contrôle de Source</h3>
              <p className="text-sm text-muted-foreground">Aucun changement</p>
            </div>
          )}
        </div>
        {/* Resizer */}
        <div
          className="panel-resizer"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = leftPanelWidth;
            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth + (e.clientX - startX);
              setLeftPanelWidth(Math.max(200, Math.min(500, newWidth)));
            };
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      </div>

      {/* Panneau Central - Éditeur & Aperçu */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Zone d'édition */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor />
        </div>

        {/* Panneau inférieur redimensionnable */}
        <div
          className="flex flex-col border-t border-border bg-card"
          style={{ height: `${bottomPanelHeight}px` }}
        >
          {/* Resizer */}
          <div
            className="h-1 w-full cursor-row-resize bg-border hover:bg-primary transition-colors"
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = bottomPanelHeight;
              const handleMouseMove = (e: MouseEvent) => {
                const newHeight = startHeight - (e.clientY - startY);
                setBottomPanelHeight(Math.max(150, Math.min(600, newHeight)));
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Onglets */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveBottomTab('preview')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeBottomTab === 'preview'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setActiveBottomTab('terminal')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeBottomTab === 'terminal'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Terminal
            </button>
            <button
              onClick={() => setActiveBottomTab('console')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeBottomTab === 'console'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Console
            </button>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-auto">
            {activeBottomTab === 'preview' && <PreviewPanel />}
            {activeBottomTab === 'terminal' && <Terminal />}
            {activeBottomTab === 'console' && (
              <div className="p-4 font-mono text-sm">
                <p className="text-muted-foreground">Console de débogage</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panneau Droit - Client IA */}
      <div
        className="flex flex-col border-l border-border bg-card"
        style={{ width: `${rightPanelWidth}px` }}
      >
        <ClientPanel />
        {/* Resizer */}
        <div
          className="panel-resizer"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = rightPanelWidth;
            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = startWidth - (e.clientX - startX);
              setRightPanelWidth(Math.max(300, Math.min(600, newWidth)));
            };
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      </div>
    </div>
  );
}
