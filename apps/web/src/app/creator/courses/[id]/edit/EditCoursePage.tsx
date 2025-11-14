'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Trash2, Save, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

interface EditCoursePageProps {
  courseId: string;
}

interface Section {
  id?: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id?: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'pdf';
  duration: number;
  order_index: number;
}

export function EditCoursePage({ courseId }: EditCoursePageProps) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (response.ok && data.course) {
        setCourse(data.course);
        // Charger les sections depuis l'API
        if (data.course.sections && data.course.sections.length > 0) {
          setSections(data.course.sections.map((s: any, idx: number) => ({
            id: s.id,
            title: s.title,
            order_index: idx,
            lessons: (s.lessons || []).map((l: any, lIdx: number) => ({
              id: l.id,
              title: l.title,
              type: l.type,
              duration: l.duration,
              order_index: lIdx
            }))
          })));
          // Expand all sections by default
          setExpandedSections(new Set(data.course.sections.map((_: any, idx: number) => idx)));
        }
      } else {
        console.error('Course not found');
        router.push('/creator/dashboard');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      router.push('/creator/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Section management
  const addSection = () => {
    setSections([...sections, {
      title: '',
      order_index: sections.length,
      lessons: []
    }]);
    setExpandedSections(new Set([...expandedSections, sections.length]));
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    const newExpanded = new Set(expandedSections);
    newExpanded.delete(index);
    setExpandedSections(newExpanded);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  // Lesson management
  const addLesson = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.push({
      title: '',
      type: 'video',
      duration: 0,
      order_index: newSections[sectionIndex].lessons.length
    });
    setSections(newSections);
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setSections(newSections);
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons[lessonIndex] = {
      ...newSections[sectionIndex].lessons[lessonIndex],
      [field]: value
    };
    setSections(newSections);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Vous devez être connecté');
        return;
      }

      // Préparer les données avec les sections
      const courseData = {
        ...course,
        sections: sections.map((section, sIdx) => ({
          title: section.title,
          order_index: sIdx,
          lessons: section.lessons.map((lesson, lIdx) => ({
            title: lesson.title,
            type: lesson.type,
            duration: parseInt(lesson.duration as any) || 0,
            order_index: lIdx
          }))
        }))
      };

      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cours mis à jour avec succès !');
        router.push('/creator/dashboard');
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de mettre à jour le cours'));
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
      return;
    }

    setDeleting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('Vous devez être connecté');
        return;
      }

      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        alert('Cours supprimé avec succès !');
        router.push('/creator/dashboard');
      } else {
        const data = await response.json();
        alert('Erreur: ' + (data.error || 'Impossible de supprimer le cours'));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/creator/dashboard"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Modifier le cours</h1>
          <p className="text-muted-foreground">Modifiez les informations de votre cours</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Informations de base */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Informations de base</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Titre du cours <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={course.title || ''}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Ex: Maîtriser React et Next.js"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Sous-titre <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={course.subtitle || ''}
                  onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Ex: Construisez des applications web modernes de A à Z"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={course.description || ''}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  rows={6}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Décrivez votre cours en détail..."
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Catégorie <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={course.category || ''}
                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="web-dev">Développement Web</option>
                    <option value="mobile-dev">Développement Mobile</option>
                    <option value="data-science">Data Science</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Niveau <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={course.level || ''}
                    onChange={(e) => setCourse({ ...course, level: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Tarification</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Prix <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={course.price || ''}
                    onChange={(e) => setCourse({ ...course, price: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 pr-8"
                    placeholder="99.99"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Prix barré (optionnel)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={course.compare_price || ''}
                    onChange={(e) => setCourse({ ...course, compare_price: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 pr-8"
                    placeholder="149.99"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum - Sections et Leçons */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Programme du cours</h2>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Ajouter une section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>Aucune section pour le moment. Cliquez sur "Ajouter une section" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-lg border border-border bg-secondary/50">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection(sectionIndex)}
                        className="flex h-8 w-8 items-center justify-center rounded hover:bg-background"
                      >
                        {expandedSections.has(sectionIndex) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                        placeholder={`Section ${sectionIndex + 1}: Titre de la section`}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="flex h-8 w-8 items-center justify-center rounded text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Lessons */}
                    {expandedSections.has(sectionIndex) && (
                      <div className="border-t border-border p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {section.lessons.length} leçon(s)
                          </p>
                          <button
                            type="button"
                            onClick={() => addLesson(sectionIndex)}
                            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
                          >
                            <Plus className="h-3 w-3" />
                            Ajouter une leçon
                          </button>
                        </div>

                        {section.lessons.length === 0 ? (
                          <p className="py-4 text-center text-sm text-muted-foreground">
                            Aucune leçon. Cliquez sur "Ajouter une leçon".
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="flex items-start gap-2 rounded-lg border border-border bg-background p-3">
                                <span className="mt-2 text-xs text-muted-foreground">{lessonIndex + 1}</span>
                                <div className="flex-1 space-y-2">
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                    placeholder="Titre de la leçon"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  />
                                  <div className="flex gap-2">
                                    <select
                                      value={lesson.type}
                                      onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'type', e.target.value)}
                                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                      <option value="video">Vidéo</option>
                                      <option value="text">Texte</option>
                                      <option value="quiz">Quiz</option>
                                      <option value="pdf">PDF</option>
                                    </select>
                                    <input
                                      type="number"
                                      value={lesson.duration}
                                      onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', e.target.value)}
                                      placeholder="Durée (min)"
                                      className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      min="0"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeLesson(sectionIndex, lessonIndex)}
                                  className="mt-2 flex h-6 w-6 items-center justify-center rounded text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statut */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Publication</h2>
            <div>
              <label className="mb-2 block text-sm font-medium">Statut</label>
              <select
                value={course.status || 'draft'}
                onChange={(e) => setCourse({ ...course, status: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="flex items-center gap-2 rounded-lg border border-destructive px-6 py-3 font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  Supprimer le cours
                </>
              )}
            </button>

            <div className="flex gap-3">
              <Link
                href="/creator/dashboard"
                className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-accent"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={saving || deleting}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
