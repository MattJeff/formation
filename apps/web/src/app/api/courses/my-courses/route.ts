import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Récupérer les cours du créateur connecté
export async function GET(request: Request) {
  try {
    // Récupérer le token d'authentification depuis les headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.error('❌ Pas de header Authorization');
      return NextResponse.json(
        { error: 'Non authentifié', details: 'Header Authorization manquant' },
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

    // Récupérer les cours du créateur
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (coursesError) {
      console.error('❌ Erreur récupération cours:', coursesError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des cours', details: coursesError.message },
        { status: 500 }
      );
    }

    console.log('✅ Cours récupérés:', courses?.length || 0);

    return NextResponse.json({ 
      success: true,
      courses: courses || []
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
