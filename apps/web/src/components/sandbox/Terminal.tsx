'use client';

import { useEffect, useRef } from 'react';

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Le terminal Xterm sera initialisé ici
    // Pour l'instant, on affiche un terminal simulé
  }, []);

  return (
    <div className="h-full bg-background p-4 font-mono text-sm">
      <div ref={terminalRef} className="h-full">
        <div className="text-green-400">
          <p>brainow@workspace:~/project$ npm install</p>
          <p className="text-muted-foreground">
            added 142 packages, and audited 143 packages in 3s
          </p>
          <p className="text-muted-foreground">found 0 vulnerabilities</p>
          <br />
          <p>brainow@workspace:~/project$ npm run dev</p>
          <p className="text-blue-400">&gt; dev</p>
          <p className="text-blue-400">&gt; vite</p>
          <br />
          <p className="text-green-400">VITE v5.0.0 ready in 423 ms</p>
          <p className="text-muted-foreground">➜ Local: http://localhost:5173/</p>
          <p className="text-muted-foreground">➜ Network: use --host to expose</p>
          <br />
          <p className="flex items-center">
            brainow@workspace:~/project$ <span className="ml-1 animate-pulse">▊</span>
          </p>
        </div>
      </div>
    </div>
  );
}
