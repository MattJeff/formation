import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Get all comments for a lesson
export async function GET(
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

    const lessonId = params.id;

    // Get all comments for this lesson
    const { data: comments, error: commentsError } = await supabase
      .from('lesson_comments')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('❌ Erreur récupération commentaires:', commentsError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des commentaires', details: commentsError.message },
        { status: 500 }
      );
    }

    // Créer un client admin pour récupérer les infos utilisateurs
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Enrichir les commentaires avec les informations utilisateur depuis auth.users
    const enrichedComments = await Promise.all(
      (comments || []).map(async (comment) => {
        try {
          // Récupérer l'utilisateur depuis auth.users
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(comment.user_id);

          return {
            ...comment,
            profiles: {
              id: comment.user_id,
              first_name: userData?.user?.user_metadata?.first_name || 'Utilisateur',
              last_name: userData?.user?.user_metadata?.last_name || '',
              avatar_url: userData?.user?.user_metadata?.avatar_url || null
            }
          };
        } catch (error) {
          console.error('Erreur récupération user:', error);
          return {
            ...comment,
            profiles: {
              id: comment.user_id,
              first_name: 'Utilisateur',
              last_name: '',
              avatar_url: null
            }
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      comments: enrichedComments
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(
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

    const { content, courseId, parentId } = await request.json();
    const lessonId = params.id;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Le commentaire ne peut pas être vide' },
        { status: 400 }
      );
    }

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from('lesson_comments')
      .insert({
        lesson_id: lessonId,
        course_id: courseId,
        user_id: user.id,
        content: content.trim(),
        parent_id: parentId || null
      })
      .select('*')
      .single();

    if (commentError) {
      console.error('❌ Erreur création commentaire:', commentError);
      return NextResponse.json(
        { error: 'Erreur lors de la création du commentaire', details: commentError.message },
        { status: 500 }
      );
    }

    // Enrichir avec les infos utilisateur
    const enrichedComment = {
      ...comment,
      profiles: {
        id: user.id,
        first_name: user.user_metadata?.first_name || 'Utilisateur',
        last_name: user.user_metadata?.last_name || '',
        avatar_url: user.user_metadata?.avatar_url || null
      }
    };

    return NextResponse.json({
      success: true,
      comment: enrichedComment
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(
  request: Request
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

    const { commentId } = await request.json();

    // Delete the comment (RLS policies will ensure user can only delete their own or if they're the course creator)
    const { error: deleteError } = await supabase
      .from('lesson_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      console.error('❌ Erreur suppression commentaire:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du commentaire' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
