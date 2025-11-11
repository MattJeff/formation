import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Récupérer tous les cours
export async function GET(_request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Récupérer les cours publiés depuis Supabase
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        profiles:creator_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération cours:', error);
      return NextResponse.json({ courses: [] });
    }

    return NextResponse.json({ courses: courses || [] });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau cours
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, category, level, price, comparePrice, coverImage, sections, status, requirements, learningObjectives, targetAudience } = body;

    const supabase = createRouteHandlerClient({ cookies });

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ Erreur auth:', userError);
      return NextResponse.json(
        { error: 'Non authentifié', details: userError?.message },
        { status: 401 }
      );
    }

    console.log('✅ Utilisateur authentifié:', user.id);

    // Vérifier que l'utilisateur est un creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Erreur profil:', profileError);
      // Si le profil n'existe pas, utiliser les métadonnées
      const roleFromMetadata = user.user_metadata?.role || 'learner';
      if (roleFromMetadata !== 'creator') {
        return NextResponse.json(
          { error: 'Seuls les créateurs peuvent créer des cours' },
          { status: 403 }
        );
      }
    } else if (profile?.role !== 'creator') {
      return NextResponse.json(
        { error: 'Seuls les créateurs peuvent créer des cours' },
        { status: 403 }
      );
    }

    console.log('✅ Création de cours pour:', user.id);

    // Créer le cours dans Supabase
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        creator_id: user.id,
        title,
        subtitle,
        description,
        category,
        level,
        price: parseFloat(price),
        compare_price: comparePrice ? parseFloat(comparePrice) : null,
        cover_image: coverImage,
        status: status || 'draft',
        requirements,
        learning_objectives: learningObjectives,
        target_audience: targetAudience,
      })
      .select()
      .single();

    if (courseError) {
      console.error('❌ Erreur création cours:', courseError);
      return NextResponse.json(
        { error: 'Erreur lors de la création du cours', details: courseError.message },
        { status: 500 }
      );
    }

    console.log('✅ Cours créé:', newCourse.id);

    // Créer les sections et leçons si fournies
    if (sections && sections.length > 0) {
      for (const section of sections) {
        const { data: newSection, error: sectionError } = await supabase
          .from('sections')
          .insert({
            course_id: newCourse.id,
            title: section.title,
            order_index: sections.indexOf(section),
          })
          .select()
          .single();

        if (!sectionError && newSection && section.lessons) {
          for (const lesson of section.lessons) {
            await supabase
              .from('lessons')
              .insert({
                section_id: newSection.id,
                title: lesson.title,
                type: lesson.type,
                duration: parseInt(lesson.duration) || 0,
                order_index: section.lessons.indexOf(lesson),
              });
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      course: newCourse,
      message: status === 'published' ? 'Cours publié avec succès !' : 'Brouillon sauvegardé !'
    });
  } catch (error) {
    console.error('❌ Erreur création cours:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du cours' },
      { status: 500 }
    );
  }
}
