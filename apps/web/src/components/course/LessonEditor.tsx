'use client';

import { useState } from 'react';
import { Upload, X, Link as LinkIcon, FileText, Video, File } from 'lucide-react';

interface LessonContent {
  type: 'video' | 'text' | 'pdf' | 'link' | 'file';
  title: string;
  description: string;
  content?: string; // Pour le texte ou le lien
  file?: File; // Pour les fichiers uploadés
  filePreview?: string; // Pour la prévisualisation
  duration?: string;
}

interface LessonEditorProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    duration: string;
  };
  onUpdate: (lessonId: string, field: string, value: any) => void;
  onDelete: (lessonId: string) => void;
}

export function LessonEditor({ lesson, onUpdate, onDelete }: LessonEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState<LessonContent>({
    type: lesson.type as any,
    title: lesson.title,
    description: '',
    duration: lesson.duration,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          file,
          filePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setContent(prev => ({
      ...prev,
      file: undefined,
      filePreview: undefined,
    }));
  };

  const renderContentEditor = () => {
    switch (content.type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Vidéo</label>
              {content.filePreview ? (
                <div className="relative">
                  <video
                    src={content.filePreview}
                    controls
                    className="w-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-8 hover:border-primary">
                  <Video className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Uploader une vidéo</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV jusqu'à 500MB</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Ou URL vidéo (YouTube, Vimeo, Mux)</label>
              <input
                type="url"
                value={content.content || ''}
                onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="mb-2 block text-sm font-medium">Contenu texte</label>
            <textarea
              value={content.content || ''}
              onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
              rows={10}
              placeholder="Écrivez votre contenu ici..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Supporte le Markdown
            </p>
          </div>
        );

      case 'pdf':
        return (
          <div>
            <label className="mb-2 block text-sm font-medium">Document PDF</label>
            {content.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <FileText className="h-8 w-8 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">{content.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(content.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-8 hover:border-primary">
                <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Uploader un PDF</p>
                <p className="text-xs text-muted-foreground">PDF jusqu'à 50MB</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        );

      case 'link':
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">URL</label>
              <input
                type="url"
                value={content.content || ''}
                onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description du lien</label>
              <textarea
                value={content.description || ''}
                onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Décrivez ce lien..."
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
        );

      case 'file':
        return (
          <div>
            <label className="mb-2 block text-sm font-medium">Fichier (ZIP, code source, etc.)</label>
            {content.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <File className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">{content.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(content.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-8 hover:border-primary">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Uploader un fichier</p>
                <p className="text-xs text-muted-foreground">ZIP, code source jusqu'à 100MB</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        );
    }
  };

  if (!isExpanded) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
          {content.type === 'video' && <Video className="h-4 w-4 text-primary" />}
          {content.type === 'text' && <FileText className="h-4 w-4 text-primary" />}
          {content.type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
          {content.type === 'link' && <LinkIcon className="h-4 w-4 text-primary" />}
          {content.type === 'file' && <File className="h-4 w-4 text-primary" />}
        </div>
        <input
          type="text"
          value={content.title}
          onChange={(e) => {
            setContent(prev => ({ ...prev, title: e.target.value }));
            onUpdate(lesson.id, 'title', e.target.value);
          }}
          placeholder="Titre de la leçon"
          className="flex-1 bg-transparent px-2 py-1 text-sm outline-none"
        />
        <select
          value={content.type}
          onChange={(e) => {
            setContent(prev => ({ ...prev, type: e.target.value as any }));
            onUpdate(lesson.id, 'type', e.target.value);
          }}
          className="rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          <option value="video">Vidéo</option>
          <option value="text">Texte</option>
          <option value="pdf">PDF</option>
          <option value="link">Lien</option>
          <option value="file">Fichier</option>
        </select>
        <input
          type="text"
          value={content.duration}
          onChange={(e) => {
            setContent(prev => ({ ...prev, duration: e.target.value }));
            onUpdate(lesson.id, 'duration', e.target.value);
          }}
          placeholder="5:00"
          className="w-20 rounded-md border border-input bg-background px-3 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="rounded-md px-3 py-1 text-sm text-primary hover:underline"
        >
          Éditer
        </button>
        <button
          type="button"
          onClick={() => onDelete(lesson.id)}
          className="rounded-md p-1 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold">Éditer la leçon</h4>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="text-sm text-primary hover:underline"
        >
          Réduire
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Titre de la leçon</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Introduction à React"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            value={content.description}
            onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Décrivez ce que les étudiants vont apprendre..."
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Type de contenu</label>
            <select
              value={content.type}
              onChange={(e) => setContent(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="video">Vidéo</option>
              <option value="text">Texte / Article</option>
              <option value="pdf">Document PDF</option>
              <option value="link">Lien externe</option>
              <option value="file">Fichier téléchargeable</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Durée estimée</label>
            <input
              type="text"
              value={content.duration}
              onChange={(e) => setContent(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="10:00"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
        </div>

        {renderContentEditor()}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              onUpdate(lesson.id, 'content', content);
              setIsExpanded(false);
            }}
            className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Sauvegarder
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="rounded-lg border border-border px-6 py-2 hover:bg-accent"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
