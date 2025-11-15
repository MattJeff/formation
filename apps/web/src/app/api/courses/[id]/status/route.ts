import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// PUT - Change course status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const courseId = params.id;
    const { status } = await request.json();

    // Valider le statut
    if (!['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide. Doit être: draft, published ou archived' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est le créateur du cours
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('creator_id, title')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    if (course.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas le créateur de ce cours' },
        { status: 403 }
      );
    }

    // Si on veut publier, on doit valider le cours
    if (status === 'published') {
      // Vérifier qu'il y a au moins une section
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('id')
        .eq('course_id', courseId);

      if (sectionsError || !sections || sections.length === 0) {
        return NextResponse.json(
          { error: 'Le cours doit avoir au moins une section pour être publié' },
          { status: 400 }
        );
      }

      // Vérifier qu'il y a au moins une leçon
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .in('section_id', sections.map(s => s.id));

      if (lessonsError || !lessons || lessons.length === 0) {
        return NextResponse.json(
          { error: 'Le cours doit avoir au moins une leçon pour être publié' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('❌ Erreur mise à jour statut:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut' },
        { status: 500 }
      );
    }

    const statusMessages = {
      draft: 'Le cours a été mis en brouillon',
      published: 'Le cours a été publié avec succès',
      archived: 'Le cours a été archivé'
    };

    return NextResponse.json({
      success: true,
      message: statusMessages[status as keyof typeof statusMessages],
      status
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
