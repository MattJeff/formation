'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { X } from 'lucide-react';

// Monaco Editor chargé dynamiquement côté client uniquement
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface EditorTab {
  id: string;
  filename: string;
  language: string;
  content: string;
  modified: boolean;
}

const mockTabs: EditorTab[] = [
  {
    id: '1',
    filename: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Photographe</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Chloé Dubois - Photographe</h1>
    </header>
    
    <main>
        <div class="gallery" id="gallery">
            <!-- Les photos seront ajoutées ici -->
        </div>
        
        <!-- TODO: Ajouter le formulaire de contact -->
    </main>
    
    <footer>
        <p>Contact: chloe@example.com</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`,
    modified: true,
  },
  {
    id: '2',
    filename: 'style.css',
    language: 'css',
    content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #1a1a1a;
    color: #ffffff;
}

header {
    text-align: center;
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
    font-size: 3rem;
    font-weight: 700;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.gallery img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.gallery img:hover {
    transform: scale(1.05);
}

footer {
    text-align: center;
    padding: 2rem;
    background-color: #0a0a0a;
    margin-top: 3rem;
}`,
    modified: false,
  },
];

export function CodeEditor() {
  const [tabs, setTabs] = useState<EditorTab[]>(mockTabs);
  const [activeTabId, setActiveTabId] = useState(mockTabs[0].id);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value || !activeTab) return;
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, content: value, modified: true } : tab
      )
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Onglets */}
      <div className="flex border-b border-border bg-secondary">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`group flex items-center gap-2 border-r border-border px-4 py-2 text-sm transition-colors ${
              activeTabId === tab.id
                ? 'border-t-2 border-t-primary bg-background text-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <span>
              {tab.filename}
              {tab.modified && <span className="ml-1 text-yellow-500">●</span>}
            </span>
            <X
              className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => closeTab(tab.id, e)}
            />
          </button>
        ))}
      </div>

      {/* Éditeur Monaco */}
      <div className="flex-1">
        {activeTab && (
          <MonacoEditor
            height="100%"
            language={activeTab.language}
            value={activeTab.content}
            onChange={handleEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
