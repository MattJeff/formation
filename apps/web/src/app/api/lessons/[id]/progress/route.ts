import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Get lesson progress for the current user
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

    // Get progress for this lesson
    const { data: progress, error: progressError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', user.id)
      .single();

    if (progressError && progressError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Erreur récupération progrès:', progressError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du progrès' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: progress || { completed: false }
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Mark lesson as complete/incomplete
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

    const { completed, courseId } = await request.json();
    const lessonId = params.id;

    // Check if progress already exists
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', user.id)
      .single();

    let result;

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur mise à jour progrès:', error);
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour du progrès' },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur création progrès:', error);
        return NextResponse.json(
          { error: 'Erreur lors de la création du progrès' },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      progress: result
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
