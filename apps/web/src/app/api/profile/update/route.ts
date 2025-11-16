// ============================================
// 👤 PROFILE UPDATE API ROUTE
// ============================================
// Route: POST /api/profile/update
// Mise à jour du profil utilisateur dans la table profiles
// et synchronisation avec auth.user_metadata
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    console.log('👤 [PROFILE UPDATE] Début mise à jour profil...');

    // ============================================
    // 1️⃣ AUTHENTIFICATION
    // ============================================

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ [PROFILE UPDATE] Authorization header manquant');
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ [PROFILE UPDATE] Erreur authentification:', authError?.message);
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    console.log('✅ [PROFILE UPDATE] Utilisateur authentifié:', user.id);

    // ============================================
    // 2️⃣ RÉCUPÉRATION DES DONNÉES
    // ============================================

    const body = await req.json();
    const {
      first_name,
      last_name,
      bio,
      avatar_url,
      website,
      github,
      linkedin,
      twitter,
    } = body;

    console.log('📝 [PROFILE UPDATE] Données reçues:', {
      first_name,
      last_name,
      bio: bio?.substring(0, 50) + '...',
      avatar_url,
      website,
    });

    // ============================================
    // 3️⃣ VALIDATION
    // ============================================

    if (!first_name || !last_name) {
      console.error('❌ [PROFILE UPDATE] Prénom/Nom manquant');
      return NextResponse.json(
        { error: 'Le prénom et le nom sont requis' },
        { status: 400 }
      );
    }

    // ============================================
    // 4️⃣ MISE À JOUR PROFILES TABLE
    // ============================================

    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name,
        last_name,
        bio,
        avatar_url,
        website,
        github,
        linkedin,
        twitter,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ [PROFILE UPDATE] Erreur mise à jour profiles:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du profil' },
        { status: 500 }
      );
    }

    console.log('✅ [PROFILE UPDATE] Profil mis à jour dans la table profiles');

    // ============================================
    // 5️⃣ SYNCHRONISATION USER_METADATA
    // ============================================

    const { error: metadataError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`,
          bio,
          avatar_url,
          website,
          github,
          linkedin,
          twitter,
        },
      }
    );

    if (metadataError) {
      console.warn('⚠️ [PROFILE UPDATE] Erreur sync user_metadata:', metadataError);
      // On continue même si la sync échoue
    } else {
      console.log('✅ [PROFILE UPDATE] user_metadata synchronisé');
    }

    // ============================================
    // 6️⃣ RÉPONSE
    // ============================================

    console.log('✅ [PROFILE UPDATE] Mise à jour réussie');

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profil mis à jour avec succès',
    });

  } catch (error: any) {
    console.error('❌ [PROFILE UPDATE] Erreur:', error);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur serveur lors de la mise à jour du profil',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
