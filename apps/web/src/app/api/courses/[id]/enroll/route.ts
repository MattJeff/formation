import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST - Enroll user in a course
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

    const courseId = params.id;

    // Vérifier que le cours existe et récupérer ses infos
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price, status, creator_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le cours est publié
    if (course.status !== 'published') {
      return NextResponse.json(
        { error: 'Ce cours n\'est pas encore disponible' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur n'est pas le créateur du cours
    if (course.creator_id === user.id) {
      return NextResponse.json(
        { error: 'Vous êtes le créateur de ce cours, pas besoin de vous inscrire' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit à ce cours', enrollment: existingEnrollment },
        { status: 400 }
      );
    }

    // Déterminer le statut de paiement
    const isFree = !course.price || course.price === 0;
    const paymentStatus = isFree ? 'free' : 'pending';

    // Créer l'enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        payment_status: paymentStatus,
        payment_amount: isFree ? 0 : course.price,
        status: 'active'
      })
      .select('*')
      .single();

    if (enrollmentError) {
      console.error('❌ Erreur création enrollment:', enrollmentError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription', details: enrollmentError.message },
        { status: 500 }
      );
    }

    console.log('✅ Inscription créée:', enrollment.id);

    // Si le cours est gratuit, retourner directement
    if (isFree) {
      return NextResponse.json({
        success: true,
        enrollment,
        message: 'Inscription réussie ! Vous pouvez maintenant accéder au cours.',
        needsPayment: false
      });
    }

    // Si le cours est payant, retourner avec needsPayment=true
    // TODO: Intégrer Stripe/PayPal ici pour créer une session de paiement
    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Veuillez procéder au paiement pour accéder au cours.',
      needsPayment: true,
      paymentAmount: course.price
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Unenroll user from a course
export async function DELETE(
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

    // Mettre à jour le statut de l'enrollment à 'canceled' au lieu de supprimer
    const { error: updateError } = await supabase
      .from('enrollments')
      .update({ status: 'canceled', updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('course_id', courseId);

    if (updateError) {
      console.error('❌ Erreur annulation enrollment:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la désinscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Désinscription réussie'
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// GET - Check if user is enrolled
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

    const courseId = params.id;

    // Vérifier si l'utilisateur est inscrit
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .single();

    if (enrollmentError && enrollmentError.code !== 'PGRST116') {
      console.error('❌ Erreur vérification enrollment:', enrollmentError);
      return NextResponse.json(
        { error: 'Erreur lors de la vérification' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      enrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
