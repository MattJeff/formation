// ============================================
// 📜 CERTIFICATE GENERATION API
// ============================================
// Génère un certificat PDF pour un enrollment complété
// GET /api/certificates/[enrollmentId]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    const enrollmentId = params.enrollmentId;
    console.log('📜 [CERTIFICATE] Génération certificat pour enrollment:', enrollmentId);

    // 1. Récupérer l'enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, progress_percentage, completed_at, created_at')
      .eq('id', enrollmentId)
      .single();

    if (enrollmentError || !enrollment) {
      console.error('❌ [CERTIFICATE] Enrollment non trouvé:', enrollmentError);
      return NextResponse.json(
        { error: 'Enrollment non trouvé' },
        { status: 404 }
      );
    }

    // 2. Récupérer les infos utilisateur
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('id', enrollment.user_id)
      .single();

    if (userError || !user) {
      console.error('❌ [CERTIFICATE] Utilisateur non trouvé:', userError);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // 3. Récupérer les infos cours
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, subtitle')
      .eq('id', enrollment.course_id)
      .single();

    if (courseError || !course) {
      console.error('❌ [CERTIFICATE] Cours non trouvé:', courseError);
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      );
    }

    // 4. Vérifier que le cours est complété à 100%
    if (enrollment.progress_percentage < 100) {
      console.log('⚠️ [CERTIFICATE] Cours non complété:', enrollment.progress_percentage);
      return NextResponse.json(
        { error: 'Le cours doit être complété à 100% pour obtenir un certificat' },
        { status: 403 }
      );
    }

    // 5. Extraire les données
    const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
    const courseTitle = course.title;
    const completionDate = enrollment.completed_at
      ? new Date(enrollment.completed_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

    console.log('✅ [CERTIFICATE] Données récupérées:', { userName, courseTitle, completionDate });

    // 6. Générer le PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Dimensions A4 paysage: 297mm x 210mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Bordure décorative
    doc.setDrawColor(41, 128, 185); // Bleu
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Titre "CERTIFICAT"
    doc.setFontSize(40);
    doc.setTextColor(41, 128, 185);
    doc.text('CERTIFICAT', pageWidth / 2, 40, { align: 'center' });

    // Sous-titre
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('DE RÉUSSITE', pageWidth / 2, 55, { align: 'center' });

    // Ligne décorative
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 40, 60, pageWidth / 2 + 40, 60);

    // "Ceci certifie que"
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text('Ceci certifie que', pageWidth / 2, 80, { align: 'center' });

    // Nom de l'étudiant
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(userName, pageWidth / 2, 100, { align: 'center' });

    // Ligne sous le nom
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 60, 102, pageWidth / 2 + 60, 102);

    // "a terminé avec succès le cours"
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('a terminé avec succès le cours', pageWidth / 2, 120, { align: 'center' });

    // Titre du cours
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');

    // Gérer les titres longs avec retour à la ligne
    const maxWidth = pageWidth - 80;
    const courseLines = doc.splitTextToSize(courseTitle, maxWidth);
    const courseTitleY = 140;
    courseLines.forEach((line: string, index: number) => {
      doc.text(line, pageWidth / 2, courseTitleY + (index * 10), { align: 'center' });
    });

    // Date de complétion
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    const dateY = courseTitleY + (courseLines.length * 10) + 15;
    doc.text(`Complété le ${completionDate}`, pageWidth / 2, dateY, { align: 'center' });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Plateforme de Formation', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // ID du certificat
    doc.setFontSize(8);
    doc.text(`ID: ${enrollmentId}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

    // 7. Convertir en buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    console.log('✅ [CERTIFICATE] PDF généré, taille:', pdfBuffer.length, 'bytes');

    // 8. Retourner le PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificat-${courseTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('❌ [CERTIFICATE] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur génération certificat', details: error.message },
      { status: 500 }
    );
  }
}
