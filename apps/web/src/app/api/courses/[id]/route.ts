import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - Récupérer un cours spécifique (public ou privé)
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Récupérer le cours avec ses sections et leçons
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        profiles:creator_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (courseError || !course) {
      console.error('❌ Erreur récupération cours:', courseError);
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les sections avec leurs leçons
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select(`
        *,
        lessons (*)
      `)
      .eq('course_id', id)
      .order('order_index', { ascending: true });

    if (!sectionsError && sections) {
      // Trier les leçons dans chaque section
      sections.forEach(section => {
        if (section.lessons) {
          section.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
        }
      });
    }

    return NextResponse.json({
      course: {
        ...course,
        sections: sections || []
      }
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du cours' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un cours
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, subtitle, description, category, level, price, comparePrice, coverImage, status, requirements, learningObjectives, targetAudience, sections } = body;

    // Récupérer le token d'authentification
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

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur est le créateur du cours
    const { data: course } = await supabase
      .from('courses')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!course || course.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Mettre à jour le cours
    const { error: updateError } = await supabase
      .from('courses')
      .update({
        title,
        subtitle,
        description,
        category,
        level,
        price: parseFloat(price),
        compare_price: comparePrice ? parseFloat(comparePrice) : null,
        cover_image: coverImage,
        status,
        requirements,
        learning_objectives: learningObjectives,
        target_audience: targetAudience,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('❌ Erreur mise à jour:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du cours' },
        { status: 500 }
      );
    }

    // Si des sections sont fournies, les mettre à jour
    if (sections) {
      // Supprimer les anciennes sections et leçons
      await supabase.from('sections').delete().eq('course_id', id);

      // Créer les nouvelles sections
      for (const section of sections) {
        const { data: newSection, error: sectionError } = await supabase
          .from('sections')
          .insert({
            course_id: id,
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
      message: 'Cours mis à jour avec succès !'
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du cours' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un cours
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer le token d'authentification
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

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur est le créateur du cours
    const { data: course } = await supabase
      .from('courses')
      .select('creator_id')
      .eq('id', id)
      .single();

    if (!course || course.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Supprimer le cours (cascade supprimera les sections et leçons)
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('❌ Erreur suppression:', deleteError);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du cours' },
        { status: 500 }
      );
    }

    console.log('✅ Cours supprimé:', id);

    return NextResponse.json({
      success: true,
      message: 'Cours supprimé avec succès !'
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du cours' },
      { status: 500 }
    );
  }
}
