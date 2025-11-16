'use client';

// ============================================
// 📝 REVIEWS SECTION COMPONENT
// ============================================
// Affiche les avis d'un cours + formulaire pour en laisser un
// Utilise l'API /api/courses/[id]/reviews
// ============================================

import { useState, useEffect } from 'react';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

interface ReviewsSectionProps {
  courseId: string;
  averageRating?: number;
  totalReviews?: number;
  isEnrolled?: boolean;
}

export function ReviewsSection({
  courseId,
  averageRating = 0,
  totalReviews = 0,
  isEnrolled = false,
}: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Charger les reviews
  useEffect(() => {
    loadReviews();
  }, [courseId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/reviews`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);

        // Si l'utilisateur a déjà laissé un avis, pré-remplir le formulaire
        const userReview = data.reviews.find((r: Review) => r.user.id === user?.id);
        if (userReview) {
          setRating(userReview.rating);
          setComment(userReview.comment || '');
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Vous devez être connecté');
      return;
    }

    if (!isEnrolled) {
      setError('Vous devez être inscrit au cours');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          rating,
          comment: comment.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'avis');
      }

      // Recharger les reviews
      await loadReviews();

      // Message de succès
      alert('Merci pour votre avis!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value: number, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= (interactive ? (hoverRating || rating) : value);
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 ${
            filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onClick={interactive ? () => setRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-8">
      {/* Header avec stats */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Avis des étudiants</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-lg font-semibold">
              {averageRating > 0 ? averageRating.toFixed(1) : 'Aucun avis'}
            </span>
          </div>
          <span className="text-muted-foreground">
            ({totalReviews} {totalReviews > 1 ? 'avis' : 'avis'})
          </span>
        </div>
      </div>

      {/* Formulaire (si inscrit) */}
      {isEnrolled && user && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Laisser un avis</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium">Note</label>
              <div className="flex gap-1">{renderStars(rating, true)}</div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Commentaire (optionnel)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Partagez votre expérience avec ce cours..."
              />
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Envoi...' : 'Publier l\'avis'}
            </button>
          </form>
        </div>
      )}

      {/* Liste des reviews */}
      <div className="space-y-4 min-w-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Aucun avis pour le moment</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-border bg-card p-6 min-w-0 overflow-hidden"
            >
              {/* Header */}
              <div className="mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {review.user.first_name && review.user.last_name
                      ? `${review.user.first_name} ${review.user.last_name}`
                      : review.user.email}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <div className="flex flex-shrink-0">{renderStars(review.rating)}</div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Commentaire */}
              {review.comment && (
                <p className="text-muted-foreground break-words overflow-wrap-anywhere">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
