'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  modified?: boolean;
}

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file', modified: true },
      { name: 'style.css', type: 'file' },
      { name: 'script.js', type: 'file', modified: true },
    ],
  },
  {
    name: 'images',
    type: 'folder',
    children: [
      { name: 'photo1.jpg', type: 'file' },
      { name: 'photo2.jpg', type: 'file' },
      { name: 'photo3.jpg', type: 'file' },
      { name: 'photo4.jpg', type: 'file' },
      { name: 'photo5.jpg', type: 'file' },
      { name: 'photo6.jpg', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
];

export function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.json')) return <FileJson className="h-4 w-4 text-yellow-500" />;
    if (name.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400" />;
    if (name.endsWith('.html')) return <FileCode className="h-4 w-4 text-orange-500" />;
    if (name.endsWith('.css')) return <FileCode className="h-4 w-4 text-blue-500" />;
    if (name.endsWith('.js') || name.endsWith('.ts'))
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const renderNode = (node: FileNode, path: string, depth: number = 0) => {
    const fullPath = `${path}/${node.name}`;
    const isExpanded = expandedFolders.has(fullPath);

    if (node.type === 'folder') {
      return (
        <div key={fullPath}>
          <button
            onClick={() => toggleFolder(fullPath)}
            className="flex w-full items-center gap-1 px-2 py-1 text-sm hover:bg-accent transition-colors"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-400" />
            ) : (
              <Folder className="h-4 w-4 text-blue-400" />
            )}
            <span className="font-medium">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div>{node.children.map((child) => renderNode(child, fullPath, depth + 1))}</div>
          )}
        </div>
      );
    }

    return (
      <button
        key={fullPath}
        className="flex w-full items-center gap-2 px-2 py-1 text-sm hover:bg-accent transition-colors"
        style={{ paddingLeft: `${depth * 12 + 28}px` }}
      >
        {getFileIcon(node.name)}
        <span className={node.modified ? 'text-yellow-500' : ''}>
          {node.name}
          {node.modified && <span className="ml-1">●</span>}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="border-b border-border px-4 py-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Explorateur
        </h3>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {mockFileTree.map((node) => renderNode(node, '', 0))}
      </div>
    </div>
  );
}
