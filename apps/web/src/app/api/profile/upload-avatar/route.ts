// ============================================
// 📸 AVATAR UPLOAD API ROUTE
// ============================================
// Route: POST /api/profile/upload-avatar
// Upload d'avatar dans Supabase Storage
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export async function POST(req: NextRequest) {
  try {
    console.log('📸 [AVATAR UPLOAD] Début upload avatar...');

    // ============================================
    // 1️⃣ AUTHENTIFICATION
    // ============================================

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ [AVATAR UPLOAD] Authorization header manquant');
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ [AVATAR UPLOAD] Erreur authentification:', authError?.message);
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    console.log('✅ [AVATAR UPLOAD] Utilisateur authentifié:', user.id);

    // ============================================
    // 2️⃣ RÉCUPÉRATION DU FICHIER
    // ============================================

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ [AVATAR UPLOAD] Aucun fichier reçu');
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    console.log('📁 [AVATAR UPLOAD] Fichier reçu:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // ============================================
    // 3️⃣ VALIDATION
    // ============================================

    // Vérifier le type
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.error('❌ [AVATAR UPLOAD] Type de fichier non autorisé:', file.type);
      return NextResponse.json(
        { error: 'Format de fichier non autorisé. Utilisez JPG, PNG ou WebP' },
        { status: 400 }
      );
    }

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      console.error('❌ [AVATAR UPLOAD] Fichier trop volumineux:', file.size);
      return NextResponse.json(
        { error: 'Le fichier ne doit pas dépasser 5MB' },
        { status: 400 }
      );
    }

    // ============================================
    // 4️⃣ SUPPRESSION DE L'ANCIEN AVATAR
    // ============================================

    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      // Extraire le chemin du fichier depuis l'URL
      const oldFilePath = profile.avatar_url.split('/').slice(-1)[0];
      if (oldFilePath && oldFilePath !== 'default-avatar.png') {
        console.log('🗑️ [AVATAR UPLOAD] Suppression ancien avatar:', oldFilePath);
        await supabase.storage.from(BUCKET_NAME).remove([`${user.id}/${oldFilePath}`]);
      }
    }

    // ============================================
    // 5️⃣ UPLOAD DU NOUVEAU FICHIER
    // ============================================

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    console.log('⬆️ [AVATAR UPLOAD] Upload vers:', filePath);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ [AVATAR UPLOAD] Erreur upload:', uploadError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      );
    }

    console.log('✅ [AVATAR UPLOAD] Fichier uploadé:', uploadData.path);

    // ============================================
    // 6️⃣ RÉCUPÉRATION DE L'URL PUBLIQUE
    // ============================================

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    console.log('🔗 [AVATAR UPLOAD] URL publique:', avatarUrl);

    // ============================================
    // 7️⃣ MISE À JOUR DU PROFIL
    // ============================================

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ [AVATAR UPLOAD] Erreur mise à jour profil:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du profil' },
        { status: 500 }
      );
    }

    // Sync user_metadata
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { avatar_url: avatarUrl },
    });

    console.log('✅ [AVATAR UPLOAD] Avatar mis à jour avec succès');

    // ============================================
    // 8️⃣ RÉPONSE
    // ============================================

    return NextResponse.json({
      success: true,
      avatar_url: avatarUrl,
      message: 'Avatar uploadé avec succès',
    });

  } catch (error: any) {
    console.error('❌ [AVATAR UPLOAD] Erreur:', error);
    console.error('Stack trace:', error.stack);

    return NextResponse.json(
      {
        error: 'Erreur serveur lors de l\'upload de l\'avatar',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
