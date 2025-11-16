'use client';

// ============================================
// 📚 CATALOGUE DE COURS PUBLIC
// ============================================
// Page principale du catalogue avec recherche et filtres
//
// FONCTIONNALITÉS:
// - Recherche par titre (temps réel avec debounce)
// - Filtres: catégorie, niveau, prix
// - Tri: popularité, date, note, prix
// - Pagination avec "Load More"
//
// DEBUGGING:
// - Logs préfixés: [PUBLIC COURSES]
// - Vérifier la console pour les requêtes Supabase
// ============================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { Search, Filter, X } from 'lucide-react';

// Types
interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compare_price: number | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  cover_image: string | null;
  average_rating: number | null;
  total_reviews: number;
  students_count: number;
  created_at: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
}

export function CoursesClient() {
  // ============================================
  // 🎯 STATE MANAGEMENT
  // ============================================
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Recherche et filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'free' | 'paid'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'rating' | 'price_asc' | 'price_desc'>('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [displayCount, setDisplayCount] = useState(9);
  const LOAD_MORE_COUNT = 9;

  // ============================================
  // 🔄 INITIAL LOAD
  // ============================================
  useEffect(() => {
    console.log('🔄 [PUBLIC COURSES] useEffect - hasAttempted:', hasAttemptedLoad);

    if (!hasAttemptedLoad) {
      console.log('🚀 [PUBLIC COURSES] Déclenchement du chargement');
      setHasAttemptedLoad(true);
      fetchCourses();
    }
  }, [hasAttemptedLoad]);

  // ============================================
  // 📚 FETCH COURSES FROM SUPABASE
  // ============================================
  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('📚 [PUBLIC COURSES] Chargement des cours publics');

      const { data: courses, error} = await supabase
        .from('courses')
        .select(`
          *,
          average_rating,
          total_reviews,
          profiles:creator_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [PUBLIC COURSES] Erreur chargement cours:', error);
        return;
      }

      console.log('✅ [PUBLIC COURSES] Cours chargés:', courses?.length || 0);
      setCourses(courses || []);

      // Extraire les catégories uniques
      const categories = Array.from(new Set(courses?.map(c => c.category).filter(Boolean))) as string[];
      setAvailableCategories(categories);
      console.log('📁 [PUBLIC COURSES] Catégories disponibles:', categories);
    } catch (error) {
      console.error('❌ [PUBLIC COURSES] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🔍 SEARCH AND FILTER LOGIC
  // ============================================
  useEffect(() => {
    console.log('🔍 [PUBLIC COURSES] Application des filtres', {
      searchQuery,
      selectedCategory,
      selectedLevel,
      priceRange,
      minRating,
      sortBy,
    });

    let result = [...courses];

    // 1️⃣ Recherche par titre
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.subtitle?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
      console.log(`🔎 [PUBLIC COURSES] Après recherche "${searchQuery}": ${result.length} cours`);
    }

    // 2️⃣ Filtre par catégorie
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
      console.log(`📁 [PUBLIC COURSES] Après filtre catégorie "${selectedCategory}": ${result.length} cours`);
    }

    // 3️⃣ Filtre par niveau
    if (selectedLevel !== 'all') {
      result = result.filter(course => course.level === selectedLevel);
      console.log(`📊 [PUBLIC COURSES] Après filtre niveau "${selectedLevel}": ${result.length} cours`);
    }

    // 4️⃣ Filtre par prix
    if (priceRange === 'free') {
      result = result.filter(course => course.price === 0);
      console.log(`💰 [PUBLIC COURSES] Après filtre gratuit: ${result.length} cours`);
    } else if (priceRange === 'paid') {
      result = result.filter(course => course.price > 0);
      console.log(`💰 [PUBLIC COURSES] Après filtre payant: ${result.length} cours`);
    }

    // 5️⃣ Filtre par note minimale
    if (minRating > 0) {
      result = result.filter(course => (course.average_rating || 0) >= minRating);
      console.log(`⭐ [PUBLIC COURSES] Après filtre note >= ${minRating}: ${result.length} cours`);
    }

    // 6️⃣ Tri
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => (b.students_count || 0) - (a.students_count || 0));
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    console.log(`✅ [PUBLIC COURSES] Résultat final: ${result.length} cours`);
    setFilteredCourses(result);
    setDisplayCount(LOAD_MORE_COUNT); // Reset pagination
  }, [courses, searchQuery, selectedCategory, selectedLevel, priceRange, minRating, sortBy]);

  // ============================================
  // 🎨 HELPER FUNCTIONS
  // ============================================
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + LOAD_MORE_COUNT);
    console.log(`📄 [PUBLIC COURSES] Load more: affichage de ${displayCount + LOAD_MORE_COUNT} cours`);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setPriceRange('all');
    setMinRating(0);
    console.log('🔄 [PUBLIC COURSES] Réinitialisation des filtres');
  };

  const activeFiltersCount = [
    searchQuery.trim() !== '',
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    priceRange !== 'all',
    minRating > 0,
  ].filter(Boolean).length;

  // Courses à afficher avec pagination
  const displayedCourses = filteredCourses.slice(0, displayCount);
  const hasMore = displayCount < filteredCourses.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-secondary py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Explorez nos cours</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Des formations pratiques pour développer vos compétences professionnelles
          </p>

          {/* Search Bar */}
          <div className="flex max-w-2xl gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:bg-accent'
              }`}
            >
              <Filter className="h-5 w-5" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-bold text-primary">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 max-w-2xl rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtres</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Catégorie */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-4 py-2"
                  >
                    <option value="all">Toutes les catégories</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'web-dev' && 'Développement Web'}
                        {category === 'mobile-dev' && 'Développement Mobile'}
                        {category === 'data-science' && 'Data Science'}
                        {category === 'design' && 'Design'}
                        {category === 'business' && 'Business'}
                        {category === 'marketing' && 'Marketing'}
                        {category === 'photography' && 'Photographie'}
                        {category === 'music' && 'Musique'}
                        {category === 'health' && 'Santé & Fitness'}
                        {category === 'personal-development' && 'Développement personnel'}
                        {!['web-dev', 'mobile-dev', 'data-science', 'design', 'business', 'marketing', 'photography', 'music', 'health', 'personal-development'].includes(category) && category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Niveau */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Niveau</label>
                  <div className="grid grid-cols-2 gap-2 sm:flex">
                    <button
                      onClick={() => setSelectedLevel('all')}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors sm:flex-1 ${
                        selectedLevel === 'all'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setSelectedLevel('beginner')}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors sm:flex-1 ${
                        selectedLevel === 'beginner'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Débutant
                    </button>
                    <button
                      onClick={() => setSelectedLevel('intermediate')}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors sm:flex-1 ${
                        selectedLevel === 'intermediate'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Intermédiaire
                    </button>
                    <button
                      onClick={() => setSelectedLevel('advanced')}
                      className={`rounded-lg border px-4 py-2 text-sm transition-colors sm:flex-1 ${
                        selectedLevel === 'advanced'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Avancé
                    </button>
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Prix</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPriceRange('all')}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        priceRange === 'all'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setPriceRange('free')}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        priceRange === 'free'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Gratuit
                    </button>
                    <button
                      onClick={() => setPriceRange('paid')}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        priceRange === 'paid'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Payant
                    </button>
                  </div>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Note minimale</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMinRating(0)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        minRating === 0
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      Toutes
                    </button>
                    <button
                      onClick={() => setMinRating(3)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        minRating === 3
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      3+ ⭐
                    </button>
                    <button
                      onClick={() => setMinRating(4)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        minRating === 4
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      4+ ⭐
                    </button>
                    <button
                      onClick={() => setMinRating(4.5)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm transition-colors ${
                        minRating === 4.5
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-accent'
                      }`}
                    >
                      4.5+ ⭐
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">
            {filteredCourses.length === courses.length
              ? `Tous les cours (${filteredCourses.length})`
              : `${filteredCourses.length} cours trouvé${filteredCourses.length > 1 ? 's' : ''}`}
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border border-input bg-background px-4 py-2"
          >
            <option value="popular">Plus populaires</option>
            <option value="recent">Plus récents</option>
            <option value="rating">Mieux notés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Chargement des cours...</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-2 text-lg font-medium">Aucun cours trouvé</p>
            <p className="mb-4 text-muted-foreground">
              {courses.length === 0
                ? 'Aucun cours disponible pour le moment.'
                : 'Essayez de modifier vos filtres de recherche.'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="rounded-lg border border-primary bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={course.cover_image || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {course.level === 'beginner' && 'Débutant'}
                        {course.level === 'intermediate' && 'Intermédiaire'}
                        {course.level === 'advanced' && 'Avancé'}
                      </span>
                      <span className="text-lg font-bold">
                        {course.price === 0 ? 'Gratuit' : `${course.price}€`}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                      {course.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {course.subtitle || course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {course.profiles && (
                        <span>Par {course.profiles.first_name} {course.profiles.last_name}</span>
                      )}
                      {course.average_rating && course.average_rating > 0 ? (
                        <span className="flex items-center gap-1">
                          ⭐ {course.average_rating.toFixed(1)} ({course.total_reviews})
                        </span>
                      ) : (
                        <span className="text-xs">Pas encore d'avis</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  className="rounded-lg border border-border bg-background px-8 py-3 font-medium hover:bg-accent"
                >
                  Charger plus de cours ({filteredCourses.length - displayCount} restants)
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
