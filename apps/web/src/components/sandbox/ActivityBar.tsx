'use client';

import { Files, Search, GitBranch, Terminal as TerminalIcon } from 'lucide-react';

interface ActivityBarProps {
  activeTab: 'files' | 'search' | 'git' | 'terminal';
  onTabChange: (tab: 'files' | 'search' | 'git' | 'terminal') => void;
}

export function ActivityBar({ activeTab, onTabChange }: ActivityBarProps) {
  const tabs = [
    { id: 'files' as const, icon: Files, label: 'Fichiers' },
    { id: 'search' as const, icon: Search, label: 'Recherche' },
    { id: 'git' as const, icon: GitBranch, label: 'Git' },
    { id: 'terminal' as const, icon: TerminalIcon, label: 'Terminal' },
  ];

  return (
    <div className="flex w-12 flex-col items-center border-r border-border bg-secondary py-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative mb-2 flex h-12 w-12 items-center justify-center rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-accent text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
            title={tab.label}
          >
            <Icon className="h-6 w-6" />
            {activeTab === tab.id && (
              <div className="absolute left-0 h-8 w-0.5 bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
