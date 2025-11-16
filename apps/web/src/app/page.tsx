'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Star,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Sparkles,
  Target,
  Rocket,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 animate-gradient" />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-20 pb-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
              <Sparkles className="h-4 w-4" />
              Plateforme de formation nouvelle génération
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Forgez vos compétences
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                dans le feu de l'action
              </span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 blur-2xl -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-xl text-muted-foreground md:text-2xl leading-relaxed"
          >
            Transformez votre apprentissage avec des cours interactifs,
            un suivi personnalisé et des certificats vérifiables.
            <span className="font-semibold text-foreground">Rejoignez 10 000+ apprenants</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/courses"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all hover:scale-105"
            >
              <Rocket className="h-5 w-5" />
              Explorer les cours
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-border bg-background/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold hover:bg-accent hover:border-primary transition-all"
            >
              <Play className="h-5 w-5" />
              Commencer gratuitement
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <StatCard number="10,000+" label="Étudiants actifs" />
            <StatCard number="500+" label="Cours disponibles" />
            <StatCard number="95%" label="Taux de satisfaction" />
            <StatCard number="50+" label="Formateurs experts" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                SkillForge
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme pensée pour maximiser votre apprentissage
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ils ont transformé leur carrière
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez les success stories de notre communauté
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="relative rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12"
              >
                <div className="absolute -top-4 -left-4 text-8xl text-primary/10 font-serif">"</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {testimonials[activeTestimonial].name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed mb-6">
                  {testimonials[activeTestimonial].content}
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'w-8 bg-primary' : 'w-2 bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-600 opacity-90" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Prêt à transformer votre avenir ?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Rejoignez des milliers d'apprenants qui ont déjà fait le premier pas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-white text-primary px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/50 transition-all hover:scale-105"
              >
                <Rocket className="h-5 w-5" />
                Commencer maintenant
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-all"
              >
                Explorer les cours
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Components

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Data

const features = [
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: 'Cours Structurés',
    description: 'Des formations complètes avec vidéos, exercices et projets pratiques pour un apprentissage optimal',
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: 'Suivi Personnalisé',
    description: 'Suivez votre progression en temps réel avec des statistiques détaillées et des objectifs clairs',
  },
  {
    icon: <GraduationCap className="h-7 w-7" />,
    title: 'Certificats Officiels',
    description: 'Obtenez des certificats PDF vérifiables pour valoriser vos compétences auprès des employeurs',
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: 'Communauté Active',
    description: 'Échangez avec des formateurs experts et une communauté de 10 000+ apprenants passionnés',
  },
];

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Développeuse Full-Stack',
    content: 'SkillForge a complètement transformé ma carrière. En 6 mois, je suis passée de débutante à développeuse junior. Les cours sont incroyablement bien structurés et les formateurs sont toujours disponibles.',
  },
  {
    name: 'Thomas Dubois',
    role: 'Product Designer',
    content: 'La qualité des formations est exceptionnelle. J\'ai pu apprendre à mon rythme tout en travaillant à temps plein. Le système de suivi de progression m\'a vraiment aidé à rester motivé.',
  },
  {
    name: 'Marie Laurent',
    role: 'Data Analyst',
    content: 'Meilleur investissement de ma vie ! Les certificats m\'ont aidée à décrocher mon premier emploi en data. La plateforme est intuitive et les cours sont à jour avec les dernières technologies.',
  },
];

