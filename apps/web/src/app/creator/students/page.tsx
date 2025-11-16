'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Users, Search, BookOpen, Clock, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

interface Student {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  course: {
    title: string;
  };
}

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadStudents();
    }
  }, [user?.id]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((s) => {
        const userName = `${s.user.first_name || ''} ${s.user.last_name || ''} ${s.user.email}`.toLowerCase();
        const courseName = s.course.title.toLowerCase();
        return userName.includes(searchQuery.toLowerCase()) || courseName.includes(searchQuery.toLowerCase());
      });
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // 1. Charger les cours du créateur
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('creator_id', user.id);

      if (!courses || courses.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const courseIds = courses.map((c) => c.id);

      // 2. Charger les enrollments pour ces cours
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id, user_id, course_id, progress_percentage, created_at, updated_at')
        .in('course_id', courseIds)
        .order('created_at', { ascending: false });

      if (!enrollments || enrollments.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // 3. Enrichir avec les données utilisateur et cours
      const enrichedStudents = await Promise.all(
        enrollments.map(async (enrollment) => {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', enrollment.user_id)
            .single();

          const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', enrollment.course_id)
            .single();

          return {
            ...enrollment,
            user: userProfile || { first_name: null, last_name: null, email: 'Inconnu' },
            course: course || { title: 'Cours inconnu' }
          };
        })
      );

      setStudents(enrichedStudents);
      setFilteredStudents(enrichedStudents);
    } catch (error) {
      console.error('❌ [STUDENTS] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (student: Student) => {
    if (student.user.first_name && student.user.last_name) {
      return `${student.user.first_name} ${student.user.last_name}`;
    }
    return student.user.email;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Étudiants ({students.length})</h1>
            <p className="text-muted-foreground">Gérez vos étudiants et suivez leur progression</p>
          </div>
        </div>

        {students.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un étudiant ou un cours..."
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {filteredStudents.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {students.length === 0 ? 'Aucun étudiant pour le moment' : 'Aucun résultat'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {students.length === 0
                ? "Vos étudiants apparaîtront ici une fois qu'ils se seront inscrits à vos cours"
                : 'Aucun étudiant ne correspond à votre recherche'}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Étudiant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Cours</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Progression</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date d'inscription</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Dernière activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-secondary/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{getStudentName(student)}</p>
                            <p className="text-sm text-muted-foreground">{student.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{student.course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${student.progress_percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{student.progress_percentage}%</span>
                          {student.progress_percentage === 100 && (
                            <Award className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(student.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(student.updated_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
