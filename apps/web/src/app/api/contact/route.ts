// ============================================
// 📧 CONTACT FORM API ROUTE
// ============================================
// Route: POST /api/contact
// Traite les demandes de contact depuis la page FAQ
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Préparer le contenu HTML
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouvelle demande de contact</h2>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Type de problème:</strong> ${problemType}</p>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>

        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3>Description:</h3>
          <p style="white-space: pre-wrap;">${description}</p>
        </div>

        ${screenshot ? '<p style="margin-top: 20px;"><strong>Note:</strong> Un screenshot a été joint à ce message.</p>' : ''}

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

        <p style="color: #6b7280; font-size: 12px;">
          Pour répondre, envoyez un email à: <a href="mailto:${email}">${email}</a>
        </p>
      </div>
    `;

    // Préparer les attachements si screenshot
    const attachments: any[] = [];
    if (screenshot) {
      const buffer = await screenshot.arrayBuffer();
      attachments.push({
        filename: screenshot.name,
        content: Buffer.from(buffer),
      });
    }

    // Envoyer l'email au support
    const { data, error } = await resend.emails.send({
      from: 'SkillForge Support <support@skillforge.com>',
      to: ['support@skillforge.com'], // Remplacez par votre vraie adresse
      replyTo: email,
      subject: `[${problemType}] Demande de contact - ${name}`,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Erreur envoi email contact:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      );
    }

    // Envoyer un email de confirmation à l'utilisateur
    await resend.emails.send({
      from: 'SkillForge Support <support@skillforge.com>',
      to: [email],
      subject: 'Votre demande a bien été reçue - SkillForge',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Merci pour votre message !</h2>

          <p>Bonjour ${name},</p>

          <p>Nous avons bien reçu votre demande concernant: <strong>${problemType}</strong></p>

          <p>Notre équipe vous répondra dans les plus brefs délais (généralement sous 24-48h).</p>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Votre message:</strong></p>
            <p style="white-space: pre-wrap; margin-top: 10px;">${description}</p>
          </div>

          <p>Cordialement,<br>L'équipe SkillForge</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

          <p style="color: #6b7280; font-size: 12px;">
            Cet email est envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
