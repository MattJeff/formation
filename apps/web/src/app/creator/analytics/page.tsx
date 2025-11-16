'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Loader2,
  Award,
  Clock,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

// Lazy load Recharts components to reduce initial bundle size
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

// ============================================
// 📊 TYPES
// ============================================

interface Analytics {
  totalRevenue: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  topCoursesByRevenue: Array<{
    courseId: string;
    title: string;
    revenue: number;
    enrollments: number;
  }>;
  topCoursesByEnrollments: Array<{
    courseId: string;
    title: string;
    enrollments: number;
    revenue: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    enrollments: number;
  }>;
  recentEnrollments: Array<{
    id: string;
    enrolledAt: string;
    courseName: string;
    studentEmail: string;
    paymentStatus: string;
    amount: number;
    progress: number;
    stripePaymentIntentId: string | null;
    status: string;
  }>;
}

// ============================================
// 🎨 COULEURS POUR LES GRAPHIQUES
// ============================================

// const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

// ============================================
// 📊 COMPOSANT ANALYTICS PAGE
// ============================================

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id]);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/creator/analytics?userId=${user.id}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error: any) {
      console.error('❌ [ANALYTICS] Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (enrollmentId: string, courseName: string, studentEmail: string) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir rembourser l'inscription de ${studentEmail} au cours "${courseName}" ?\n\nCette action est irréversible :\n- Le montant sera remboursé sur la carte bancaire\n- L'étudiant perdra l'accès au cours\n- La commission de 4% ne sera pas récupérée`
    );

    if (!confirmed) return;

    setRefundingId(enrollmentId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Session expirée');
      }

      const response = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          enrollmentId,
          reason: 'requested_by_customer',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Messages d'erreur personnalisés
        let errorMessage = data.error || 'Erreur lors du remboursement';

        if (errorMessage.includes('test mode key')) {
          errorMessage = 'Cette inscription a été créée en mode LIVE. Pour la rembourser, vous devez utiliser les clés Stripe LIVE en production.';
        } else if (errorMessage.includes('already been refunded')) {
          errorMessage = 'Cette inscription a déjà été remboursée.';
        }

        throw new Error(errorMessage);
      }

      alert('✅ Remboursement effectué avec succès !\n\nL\'étudiant recevra le montant sous 5-10 jours ouvrés.');

      // Recharger les analytics
      loadAnalytics();
    } catch (error: any) {
      console.error('Erreur remboursement:', error);
      alert('❌ Erreur de remboursement:\n\n' + error.message);
    } finally {
      setRefundingId(null);
    }
  };

  // ============================================
  // 🔄 ÉTATS DE CHARGEMENT
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement des analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadAnalytics}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // ============================================
  // 🎨 RENDU
  // ============================================

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Suivez les performances de vos cours en temps réel
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenus totaux */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-3">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold">{analytics.totalRevenue.toFixed(2)}€</p>
                <p className="text-xs text-green-600">
                  <TrendingUp className="inline h-3 w-3" /> +12% ce mois
                </p>
              </div>
            </div>
          </div>

          {/* Total inscriptions */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total étudiants</p>
                <p className="text-2xl font-bold">{analytics.totalEnrollments}</p>
                <p className="text-xs text-blue-600">
                  <TrendingUp className="inline h-3 w-3" /> Toutes périodes
                </p>
              </div>
            </div>
          </div>

          {/* Taux de complétion */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Taux complétion</p>
                <p className="text-2xl font-bold">{analytics.averageCompletionRate}%</p>
                <p className="text-xs text-purple-600">
                  <TrendingUp className="inline h-3 w-3" /> Moyenne globale
                </p>
              </div>
            </div>
          </div>

          {/* Cours actifs */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <BookOpen className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Cours publiés</p>
                <p className="text-2xl font-bold">{analytics.topCoursesByRevenue.length}</p>
                <p className="text-xs text-orange-600">
                  <Calendar className="inline h-3 w-3" /> En ligne
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques en ligne */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Revenus mensuels */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Revenus mensuels</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenus (€)"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Inscriptions mensuelles */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Inscriptions mensuelles</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="enrollments" fill="#8b5cf6" name="Inscriptions" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top cours */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Top 5 par revenus */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Top 5 cours par revenus</h2>
            {analytics.topCoursesByRevenue.length > 0 ? (
              <div className="space-y-4">
                {analytics.topCoursesByRevenue.map((course, index) => (
                  <div key={course.courseId} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.enrollments} étudiant{course.enrollments > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{course.revenue.toFixed(2)}€</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">Aucun cours</p>
            )}
          </div>

          {/* Top 5 par inscriptions */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Top 5 cours par inscriptions</h2>
            {analytics.topCoursesByEnrollments.length > 0 ? (
              <div className="space-y-4">
                {analytics.topCoursesByEnrollments.map((course, index) => (
                  <div key={course.courseId} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">{course.revenue.toFixed(2)}€</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{course.enrollments}</p>
                      <p className="text-xs text-muted-foreground">étudiants</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">Aucun cours</p>
            )}
          </div>
        </div>

        {/* Inscriptions récentes */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">Inscriptions récentes</h2>
          {analytics.recentEnrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Étudiant</th>
                    <th className="pb-3 font-medium">Cours</th>
                    <th className="pb-3 font-medium">Montant</th>
                    <th className="pb-3 font-medium">Progression</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analytics.recentEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="text-sm">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(enrollment.enrolledAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium">{enrollment.studentEmail}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-muted-foreground">{enrollment.courseName}</span>
                      </td>
                      <td className="py-3">
                        {enrollment.paymentStatus === 'paid' ? (
                          <span className="font-medium text-green-600">
                            {enrollment.amount.toFixed(2)}€
                          </span>
                        ) : enrollment.paymentStatus === 'refunded' ? (
                          <span className="font-medium text-red-600">
                            Remboursé
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Gratuit</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        {enrollment.paymentStatus === 'paid' && enrollment.stripePaymentIntentId && enrollment.status === 'active' ? (
                          <button
                            onClick={() => handleRefund(enrollment.id, enrollment.courseName, enrollment.studentEmail)}
                            disabled={refundingId === enrollment.id}
                            className="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                          >
                            {refundingId === enrollment.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Traitement...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-3 w-3" />
                                Rembourser
                              </>
                            )}
                          </button>
                        ) : enrollment.paymentStatus === 'refunded' ? (
                          <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                            Remboursé
                          </span>
                        ) : enrollment.status === 'cancelled' ? (
                          <span className="text-xs text-muted-foreground">Annulé</span>
                        ) : enrollment.paymentStatus === 'free' ? (
                          <span className="text-xs text-muted-foreground">Gratuit</span>
                        ) : !enrollment.stripePaymentIntentId ? (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucune inscription</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Les inscriptions à vos cours apparaîtront ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
