import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function ReviewsPage({ params: _params }: { params: { id: string } }) {
  const reviews = [
    {
      id: 1,
      student: 'Alice Martin',
      rating: 5,
      comment: 'Excellent cours ! Très bien expliqué et les exercices pratiques sont parfaits.',
      date: '2024-11-08',
    },
    {
      id: 2,
      student: 'Bob Dupont',
      rating: 4,
      comment: 'Bon contenu, mais j\'aurais aimé plus d\'exemples concrets.',
      date: '2024-11-05',
    },
    {
      id: 3,
      student: 'Claire Bernard',
      rating: 5,
      comment: 'Le meilleur cours que j\'ai suivi ! Merci beaucoup.',
      date: '2024-11-03',
    },
  ];

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/creator/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux cours
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Avis & Commentaires</h1>

        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{reviews.length} avis</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm">{rating}★</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                    {review.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{review.student}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
