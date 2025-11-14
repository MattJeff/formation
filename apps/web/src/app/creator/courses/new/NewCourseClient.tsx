'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Upload, X, Plus, Save, ArrowRight, Loader2, Video, FileText, Link as LinkIcon, File } from 'lucide-react';

type Step = 'basic' | 'curriculum' | 'pricing';

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'pdf' | 'link' | 'file';
  duration: string;
  description?: string;
  content?: string;
  file?: File | null;
  fileUrl?: string; // URL du fichier existant en mode édition
}

// Composant pour éditer une leçon
function LessonEditorSimple({ lesson, lessonIndex, sectionId, onUpdate, onDelete }: {
  lesson: Lesson;
  lessonIndex: number;
  sectionId: string;
  onUpdate: (sectionId: string, lessonId: string, field: string, value: any) => void;
  onDelete: (sectionId: string, lessonId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      onUpdate(sectionId, lesson.id, 'file', uploadedFile);
    }
  };

  const removeFile = () => {
    onUpdate(sectionId, lesson.id, 'file', null);
    onUpdate(sectionId, lesson.id, 'fileUrl', '');
  };

  if (!isExpanded) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent">
        <span className="text-xs text-muted-foreground">{lessonIndex + 1}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
          {lesson.type === 'video' && <Video className="h-4 w-4 text-primary" />}
          {lesson.type === 'text' && <FileText className="h-4 w-4 text-primary" />}
          {lesson.type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
          {lesson.type === 'link' && <LinkIcon className="h-4 w-4 text-primary" />}
          {lesson.type === 'file' && <File className="h-4 w-4 text-primary" />}
        </div>
        <input
          type="text"
          value={lesson.title}
          onChange={(e) => onUpdate(sectionId, lesson.id, 'title', e.target.value)}
          className="flex-1 bg-transparent px-2 py-1 text-sm outline-none"
          placeholder="Titre de la leçon"
        />
        <select
          value={lesson.type}
          onChange={(e) => onUpdate(sectionId, lesson.id, 'type', e.target.value)}
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
          value={lesson.duration}
          onChange={(e) => onUpdate(sectionId, lesson.id, 'duration', e.target.value)}
          className="w-20 rounded-md border border-input bg-background px-3 py-1 text-sm"
          placeholder="5:00"
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
          onClick={() => onDelete(sectionId, lesson.id)}
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
          <label className="mb-2 block text-sm font-medium">Titre</label>
          <input
            type="text"
            value={lesson.title}
            onChange={(e) => onUpdate(sectionId, lesson.id, 'title', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="Ex: Introduction à React"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            value={lesson.description || ''}
            onChange={(e) => onUpdate(sectionId, lesson.id, 'description', e.target.value)}
            rows={2}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            placeholder="Décrivez cette leçon..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Type</label>
            <select
              value={lesson.type}
              onChange={(e) => onUpdate(sectionId, lesson.id, 'type', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="video">Vidéo</option>
              <option value="text">Texte</option>
              <option value="pdf">PDF</option>
              <option value="link">Lien</option>
              <option value="file">Fichier</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Durée</label>
            <input
              type="text"
              value={lesson.duration}
              onChange={(e) => onUpdate(sectionId, lesson.id, 'duration', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="10:00"
            />
          </div>
        </div>

        {/* Upload selon le type */}
        {lesson.type === 'video' && (
          <div>
            <label className="mb-2 block text-sm font-medium">Vidéo</label>
            {lesson.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <Video className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">{lesson.file.name}</p>
                  <p className="text-sm text-muted-foreground">{(lesson.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : lesson.fileUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4">
                <Video className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Vidéo existante</p>
                  <p className="text-xs text-muted-foreground">{lesson.fileUrl}</p>
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
              <>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-6 hover:border-primary">
                  <Video className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Uploader une vidéo</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV</p>
                  <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <input
                  type="url"
                  value={lesson.content || ''}
                  onChange={(e) => onUpdate(sectionId, lesson.id, 'content', e.target.value)}
                  placeholder="Ou URL vidéo (YouTube, Vimeo)"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </>
            )}
          </div>
        )}

        {lesson.type === 'text' && (
          <div>
            <label className="mb-2 block text-sm font-medium">Contenu</label>
            <textarea
              value={lesson.content || ''}
              onChange={(e) => onUpdate(sectionId, lesson.id, 'content', e.target.value)}
              rows={8}
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
              placeholder="Écrivez votre contenu..."
            />
          </div>
        )}

        {lesson.type === 'pdf' && (
          <div>
            <label className="mb-2 block text-sm font-medium">Document PDF</label>
            {lesson.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <FileText className="h-8 w-8 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">{lesson.file.name}</p>
                  <p className="text-sm text-muted-foreground">{(lesson.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={removeFile} className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : lesson.fileUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4">
                <FileText className="h-8 w-8 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">PDF existant</p>
                  <p className="text-xs text-muted-foreground">{lesson.fileUrl}</p>
                </div>
                <button type="button" onClick={removeFile} className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-6 hover:border-primary">
                <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Uploader un PDF</p>
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
        )}

        {lesson.type === 'link' && (
          <div>
            <label className="mb-2 block text-sm font-medium">URL</label>
            <input
              type="url"
              value={lesson.content || ''}
              onChange={(e) => onUpdate(sectionId, lesson.id, 'content', e.target.value)}
              placeholder="https://..."
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
        )}

        {lesson.type === 'file' && (
          <div>
            <label className="mb-2 block text-sm font-medium">Fichier</label>
            {lesson.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                <File className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">{lesson.file.name}</p>
                  <p className="text-sm text-muted-foreground">{(lesson.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button type="button" onClick={removeFile} className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : lesson.fileUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4">
                <File className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Fichier existant</p>
                  <p className="text-xs text-muted-foreground">{lesson.fileUrl}</p>
                </div>
                <button type="button" onClick={removeFile} className="rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-6 hover:border-primary">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Uploader un fichier</p>
                <p className="text-xs text-muted-foreground">ZIP, code source</p>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}

interface NewCourseClientProps {
  courseId?: string;
  mode?: 'create' | 'edit';
}

export function NewCourseClient({ courseId, mode = 'create' }: NewCourseClientProps = {}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'web-dev',
    level: 'beginner',
    price: '',
    comparePrice: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [sections, setSections] = useState<Section[]>([
    { id: '1', title: 'Introduction', lessons: [] },
  ]);

  // Charger les données en mode édition
  useEffect(() => {
    if (mode === 'edit' && courseId) {
      loadCourseData();
    }
  }, [mode, courseId]);

  const loadCourseData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.course) {
        const course = data.course;

        // Pré-remplir le formulaire
        setFormData({
          title: course.title || '',
          subtitle: course.subtitle || '',
          description: course.description || '',
          category: course.category || 'web-dev',
          level: course.level || 'beginner',
          price: course.price?.toString() || '',
          comparePrice: course.compare_price?.toString() || '',
        });

        // Pré-remplir l'image
        if (course.cover_image) {
          setImagePreview(course.cover_image);
        }

        // Pré-remplir les sections et leçons
        if (course.sections && course.sections.length > 0) {
          setSections(course.sections.map((s: any) => ({
            id: s.id || Date.now().toString(),
            title: s.title,
            lessons: (s.lessons || []).map((l: any) => ({
              id: l.id || Date.now().toString(),
              title: l.title,
              type: l.type,
              duration: l.duration?.toString() || '0',
              description: l.description || '',
              content: l.content || l.video_url || '',
              fileUrl: l.file_url || l.video_url || '',
              file: null,
            }))
          })));
        }
      } else {
        alert('❌ Impossible de charger le cours');
        router.push('/creator/dashboard');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      alert('❌ Erreur lors du chargement');
      router.push('/creator/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview('');
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      lessons: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, title: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title } : s));
  };

  const deleteSection = (id: string) => {
    if (sections.length > 1) {
      const section = sections.find(s => s.id === id);
      if (section && section.lessons.length > 0) {
        if (!confirm(`⚠️ Supprimer la section "${section.title}" ?\n\nCette action supprimera aussi ${section.lessons.length} leçon(s).`)) {
          return;
        }
      }
      setSections(sections.filter(s => s.id !== id));
    } else {
      alert('❌ Vous devez garder au moins une section');
    }
  };

  const addLesson = (sectionId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const newLesson: Lesson = {
          id: Date.now().toString(),
          title: `Leçon ${s.lessons.length + 1}`,
          type: 'video',
          duration: '5:00',
          file: null,
          fileUrl: '',
        };
        return { ...s, lessons: [...s.lessons, newLesson] };
      }
      return s;
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, field: string, value: any) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          lessons: s.lessons.map(l =>
            l.id === lessonId ? { ...l, [field]: value } : l
          ),
        };
      }
      return s;
    }));
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    if (!confirm('⚠️ Supprimer cette leçon ?')) {
      return;
    }
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, lessons: s.lessons.filter(l => l.id !== lessonId) };
      }
      return s;
    }));
  };

  const validateCourse = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Le titre est requis');
    if (formData.title.length < 10) errors.push('Le titre doit faire au moins 10 caractères');
    if (!formData.description.trim()) errors.push('La description est requise');
    if (formData.description.length < 50) errors.push('La description doit faire au moins 50 caractères');
    if (!coverImage) errors.push('L\'image de couverture est requise');
    if (!formData.category) errors.push('La catégorie est requise');
    
    return errors;
  };

  const handleSaveDraft = async () => {
    // Validation minimale pour brouillon
    if (!formData.title.trim()) {
      alert('⚠️ Le titre est requis pour sauvegarder un brouillon');
      return;
    }

    const message = mode === 'edit'
      ? '💾 Sauvegarder les modifications ?'
      : '💾 Sauvegarder ce cours comme brouillon ?';

    if (!confirm(message)) {
      return;
    }

    setSaving(true);
    try {
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const url = mode === 'edit' ? `/api/courses/${courseId}` : '/api/courses';

      console.log(`📤 Envoi de la requête ${method} ${url} (brouillon)...`);

      // Récupérer le token d'authentification
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('❌ Vous devez être connecté pour sauvegarder un cours');
        setSaving(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          sections,
          coverImage: imagePreview,
          status: 'draft',
        }),
      });

      console.log('📥 Réponse reçue:', response.status, response.statusText);

      const data = await response.json();
      console.log('📦 Données:', data);
      
      if (!response.ok) {
        const errorMessage = `❌ ERREUR ${response.status}\n\n` +
          `Status: ${response.statusText}\n` +
          `Message: ${data.error || 'Erreur inconnue'}\n` +
          `Détails: ${data.details || 'Aucun détail'}`;
        
        console.error(errorMessage);
        alert(errorMessage);
        return;
      }
      
      if (data.success) {
        alert('✅ ' + data.message);
      } else {
        alert('❌ Erreur lors de la sauvegarde\n\n' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur catch:', error);
      const errorMessage = `❌ ERREUR RÉSEAU\n\n` +
        `Type: ${error instanceof Error ? error.name : 'Unknown'}\n` +
        `Message: ${error instanceof Error ? error.message : String(error)}`;
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    // Validation complète pour publication
    const errors = validateCourse();

    if (errors.length > 0) {
      alert('❌ Erreurs de validation :\n\n' + errors.join('\n'));
      return;
    }

    if (sections.length === 0) {
      alert('❌ Vous devez créer au moins une section');
      return;
    }

    const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
    if (totalLessons === 0) {
      alert('❌ Vous devez créer au moins une leçon');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('❌ Le prix doit être supérieur à 0');
      return;
    }

    const confirmMessage = mode === 'edit'
      ? '💾 Sauvegarder et publier les modifications ?\n\nLe cours mis à jour sera visible par tous les utilisateurs.'
      : '🚀 Publier ce cours maintenant ?\n\nUne fois publié, il sera visible par tous les utilisateurs.';

    if (!confirm(confirmMessage)) {
      return;
    }

    setSaving(true);
    try {
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const url = mode === 'edit' ? `/api/courses/${courseId}` : '/api/courses';

      console.log(`📤 Envoi de la requête ${method} ${url}...`);

      // Récupérer le token d'authentification
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('❌ Vous devez être connecté pour publier un cours');
        setSaving(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          sections,
          coverImage: imagePreview,
          status: 'published',
        }),
      });

      console.log('📥 Réponse reçue:', response.status, response.statusText);

      const data = await response.json();
      console.log('📦 Données:', data);
      
      if (!response.ok) {
        // Erreur HTTP
        const errorMessage = `❌ ERREUR ${response.status}\n\n` +
          `Status: ${response.statusText}\n` +
          `Message: ${data.error || 'Erreur inconnue'}\n` +
          `Détails: ${data.details || 'Aucun détail'}`;
        
        console.error(errorMessage);
        alert(errorMessage);
        return;
      }
      
      if (data.success) {
        alert('✅ ' + data.message);
        router.push('/creator/courses');
      } else {
        alert('❌ Erreur lors de la publication\n\n' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur catch:', error);
      const errorMessage = `❌ ERREUR RÉSEAU\n\n` +
        `Type: ${error instanceof Error ? error.name : 'Unknown'}\n` +
        `Message: ${error instanceof Error ? error.message : String(error)}`;
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const canGoToNextStep = () => {
    if (currentStep === 'basic') {
      // En mode édition, on accepte imagePreview, en mode création on vérifie coverImage
      const hasImage = mode === 'edit' ? (coverImage || imagePreview) : coverImage;
      return formData.title && formData.description && hasImage;
    }
    if (currentStep === 'curriculum') {
      return sections.some(s => s.lessons.length > 0);
    }
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Informations de base</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Titre du cours <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Ex: Maîtriser React et Next.js"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Sous-titre</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Description courte du cours"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Description détaillée..."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="web-dev">Développement Web</option>
                      <option value="data-science">Data Science</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Niveau</label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Image de couverture <span className="text-destructive">*</span>
              </h2>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full rounded-lg object-cover"
                    style={{ maxHeight: '400px' }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-12 transition-colors hover:border-primary">
                  <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium">Cliquez pour uploader</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );

      case 'curriculum':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Structure du cours</h2>
                <p className="text-sm text-muted-foreground">
                  Organisez votre contenu en sections et leçons
                </p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Ajouter une section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id} className="rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        Section {index + 1}
                      </span>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Titre de la section"
                      />
                    </div>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="ml-2 rounded-md p-2 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <LessonEditorSimple
                          key={lesson.id}
                          lesson={lesson}
                          lessonIndex={lessonIndex}
                          sectionId={section.id}
                          onUpdate={updateLesson}
                          onDelete={deleteLesson}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addLesson(section.id)}
                      className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une leçon
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Tarification</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Prix du cours (€) <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="99.99"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Prix barré (€)</label>
                  <input
                    type="number"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="149.99"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Récapitulatif</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Titre:</span>
                  <span className="font-medium">{formData.title || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sections:</span>
                  <span className="font-medium">{sections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leçons:</span>
                  <span className="font-medium">
                    {sections.reduce((acc, s) => acc + s.lessons.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix:</span>
                  <span className="font-medium">{formData.price || '0'}€</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/creator/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Link>
          {mode === 'edit' && courseId && (
            <Link
              href={`/courses/${courseId}`}
              target="_blank"
              className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            >
              👁️ Prévisualiser
            </Link>
          )}
        </div>

        <h1 className="mb-8 text-3xl font-bold">
          {mode === 'edit' ? 'Modifier le cours' : 'Créer un nouveau cours'}
        </h1>

        {/* Indicateur d'étapes */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep('basic')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              currentStep === 'basic' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <span className="text-sm font-medium">1. Informations</span>
          </button>
          <div className="h-px w-12 bg-border" />
          <button
            type="button"
            onClick={() => setCurrentStep('curriculum')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              currentStep === 'curriculum' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <span className="text-sm font-medium">2. Curriculum</span>
          </button>
          <div className="h-px w-12 bg-border" />
          <button
            type="button"
            onClick={() => setCurrentStep('pricing')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              currentStep === 'pricing' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            <span className="text-sm font-medium">3. Tarification</span>
          </button>
        </div>

        {/* Contenu de l'étape */}
        {renderStepContent()}

        {/* Boutons de navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-border px-6 py-2 hover:bg-accent disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder brouillon
              </>
            )}
          </button>

          <div className="flex gap-3">
            {currentStep !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'curriculum') setCurrentStep('basic');
                  if (currentStep === 'pricing') setCurrentStep('curriculum');
                }}
                className="rounded-lg border border-border px-6 py-2 hover:bg-accent"
              >
                Précédent
              </button>
            )}
            
            {currentStep !== 'pricing' ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'basic') setCurrentStep('curriculum');
                  if (currentStep === 'curriculum') setCurrentStep('pricing');
                }}
                disabled={!canGoToNextStep()}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Suivant
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving || !formData.price}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publication...
                  </>
                ) : (
                  'Publier le cours'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
