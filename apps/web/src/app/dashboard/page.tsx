'use client';

import { DashboardClient } from './DashboardClient';
import { Header } from '@/components/layout/Header';
import { BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated, isCreator, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (isCreator) {
        router.push('/creator/dashboard');
      }
    }
  }, [isAuthenticated, isCreator, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || isCreator) {
    return null;
  }

  return <DashboardClient />;
}
