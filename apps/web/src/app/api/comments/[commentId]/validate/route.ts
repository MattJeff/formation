import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// PUT - Valider/dé-valider un commentaire (créateur uniquement)
export async function PUT(
  request: Request,
  { params }: { params: { commentId: string } }
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

    const commentId = params.commentId;

    // Récupérer le commentaire
    const { data: comment, error: commentError } = await supabase
      .from('lesson_comments')
      .select('*')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      console.error('❌ Erreur récupération commentaire:', commentError);
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer le cours pour vérifier le créateur
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('creator_id')
      .eq('id', comment.course_id)
      .single();

    if (courseError || !course) {
      console.error('❌ Erreur récupération cours:', courseError);
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le créateur du cours
    if (course.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous devez être le créateur du cours pour valider un commentaire' },
        { status: 403 }
      );
    }

    // Basculer la validation
    const newIsValidated = !comment.is_validated;

    const { error: updateError } = await supabase
      .from('lesson_comments')
      .update({ is_validated: newIsValidated })
      .eq('id', commentId);

    if (updateError) {
      console.error('❌ Erreur mise à jour validation:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la validation du commentaire' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      is_validated: newIsValidated
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
