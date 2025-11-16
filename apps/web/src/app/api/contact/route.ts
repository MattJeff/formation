// ============================================
// 📧 CONTACT FORM API ROUTE
// ============================================
// Route: POST /api/contact
// Traite les demandes de contact depuis la page FAQ
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const problemType = formData.get('problemType') as string;
    const description = formData.get('description') as string;
    const screenshot = formData.get('screenshot') as File | null;

    // Validation
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Préparer les attachements si screenshot
    const attachments: any[] = [];
    if (screenshot) {
      const buffer = await screenshot.arrayBuffer();
      attachments.push({
        filename: screenshot.name,
        content: Buffer.from(buffer),
      });
    }

    // Envoyer l'email de confirmation à l'utilisateur
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `[${problemType}] Copie de votre demande - SkillForge`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nous avons bien reçu votre message !</h2>

          <p>Bonjour ${name},</p>

          <p>Votre demande concernant: <strong>${problemType}</strong> a été enregistrée.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Détails de votre demande:</h3>
            <p><strong>Type:</strong> ${problemType}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p style="white-space: pre-wrap; margin-top: 10px;"><strong>Message:</strong><br>${description}</p>
          </div>

          <p>Notre équipe reviendra vers vous dans les plus brefs délais (généralement sous 24-48h).</p>

          <p>Cordialement,<br>L'équipe SkillForge</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

          <p style="color: #6b7280; font-size: 12px;">
            Cet email est envoyé automatiquement. Pour toute question, consultez notre <a href="${process.env.NEXT_PUBLIC_APP_URL}/faq">page FAQ</a>.
          </p>
        </div>
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Erreur envoi email contact:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      );
    }

    // Note: En production, vous recevrez une copie dans votre boîte email
    // Pour configurer un email de support dédié, ajoutez un domaine vérifié dans Resend

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
