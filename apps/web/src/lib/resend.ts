// ============================================
// 📧 RESEND EMAIL CONFIGURATION
// ============================================
// Configuration centralisée pour l'envoi d'emails via Resend
//
// FONCTIONNALITÉS:
// - Instance Resend singleton
// - Validation de la configuration
// - Templates d'emails
//
// DEBUGGING:
// - Logs préfixés: [RESEND]
// - Vérifier RESEND_API_KEY dans .env.local
// - Test emails en mode development
// ============================================

import { Resend } from 'resend';

// ============================================
// 📝 CONFIGURATION
// ============================================

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('❌ [RESEND] RESEND_API_KEY manquante dans .env.local');
}

// Instance singleton Resend
export const resend = new Resend(apiKey);

// Adresse email par défaut (sender)
export const FROM_EMAIL = 'SkillForge <noreply@skillforge.com>';

// ============================================
// 📧 TYPES D'EMAILS
// ============================================

export interface PurchaseConfirmationEmail {
  to: string;
  userName: string;
  courseName: string;
  courseUrl: string;
  price: number;
  invoiceUrl?: string;
}

export interface WelcomeFreeEmail {
  to: string;
  userName: string;
  courseName: string;
  courseUrl: string;
}

export interface NewEnrollmentNotificationEmail {
  to: string; // Email du créateur
  creatorName: string;
  studentName: string;
  courseName: string;
  courseUrl: string;
  price: number;
}

// ============================================
// 📤 FONCTIONS D'ENVOI
// ============================================

/**
 * Envoie l'email de confirmation d'achat
 */
export async function sendPurchaseConfirmationEmail(params: PurchaseConfirmationEmail) {
  console.log('📧 [RESEND] Envoi email confirmation achat:', {
    to: params.to,
    courseName: params.courseName,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Confirmation de votre achat - ${params.courseName}`,
      html: getPurchaseConfirmationTemplate(params),
    });

    if (error) {
      console.error('❌ [RESEND] Erreur envoi email achat:', error);
      throw error;
    }

    console.log('✅ [RESEND] Email confirmation envoyé:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [RESEND] Exception lors de l\'envoi:', error);
    throw error;
  }
}

/**
 * Envoie l'email de bienvenue pour un cours gratuit
 */
export async function sendWelcomeFreeEmail(params: WelcomeFreeEmail) {
  console.log('📧 [RESEND] Envoi email bienvenue gratuit:', {
    to: params.to,
    courseName: params.courseName,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Bienvenue dans ${params.courseName} !`,
      html: getWelcomeFreeTemplate(params),
    });

    if (error) {
      console.error('❌ [RESEND] Erreur envoi email gratuit:', error);
      throw error;
    }

    console.log('✅ [RESEND] Email bienvenue envoyé:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [RESEND] Exception lors de l\'envoi:', error);
    throw error;
  }
}

/**
 * Envoie une notification au créateur lors d'une nouvelle inscription
 */
export async function sendNewEnrollmentNotification(params: NewEnrollmentNotificationEmail) {
  console.log('📧 [RESEND] Envoi notification créateur:', {
    to: params.to,
    courseName: params.courseName,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `Nouvelle inscription à ${params.courseName}`,
      html: getNewEnrollmentTemplate(params),
    });

    if (error) {
      console.error('❌ [RESEND] Erreur envoi notification:', error);
      throw error;
    }

    console.log('✅ [RESEND] Notification créateur envoyée:', data?.id);
    return data;
  } catch (error) {
    console.error('❌ [RESEND] Exception lors de l\'envoi:', error);
    throw error;
  }
}

// ============================================
// 🎨 TEMPLATES HTML
// ============================================

/**
 * Template email de confirmation d'achat
 */
function getPurchaseConfirmationTemplate(params: PurchaseConfirmationEmail): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation d'achat</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      color: #8b5cf6;
      margin: 0;
      font-size: 28px;
    }
    .success-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .content {
      margin-bottom: 30px;
    }
    .course-info {
      background-color: #f8f7ff;
      border-left: 4px solid #8b5cf6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .course-name {
      font-size: 20px;
      font-weight: bold;
      color: #8b5cf6;
      margin-bottom: 10px;
    }
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .cta-button {
      display: inline-block;
      background-color: #8b5cf6;
      color: white;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Merci pour votre achat !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${params.userName},</p>

      <p>Votre paiement a bien été confirmé. Vous avez maintenant accès à votre formation !</p>

      <div class="course-info">
        <div class="course-name">${params.courseName}</div>
        <div class="price">${params.price}€</div>
      </div>

      <p><strong>Que faire maintenant ?</strong></p>
      <ul>
        <li>Commencez à suivre votre formation immédiatement</li>
        <li>Accédez à tous les modules et ressources</li>
        <li>Posez vos questions dans les commentaires</li>
      </ul>

      <center>
        <a href="${params.courseUrl}" class="cta-button">
          Commencer la formation
        </a>
      </center>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        💡 <strong>Astuce :</strong> Vous retrouverez ce cours dans votre tableau de bord "Mes cours".
      </p>
    </div>

    <div class="footer">
      <p>Vous avez reçu cet email car vous avez acheté une formation sur SkillForge.</p>
      <p>Des questions ? Répondez simplement à cet email.</p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} SkillForge - Tous droits réservés
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template email de bienvenue cours gratuit
 */
function getWelcomeFreeTemplate(params: WelcomeFreeEmail): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue !</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      color: #8b5cf6;
      margin: 0;
      font-size: 28px;
    }
    .welcome-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .content {
      margin-bottom: 30px;
    }
    .course-info {
      background-color: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .course-name {
      font-size: 20px;
      font-weight: bold;
      color: #10b981;
      margin-bottom: 10px;
    }
    .cta-button {
      display: inline-block;
      background-color: #8b5cf6;
      color: white;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="welcome-icon">🎉</div>
      <h1>Bienvenue dans votre formation !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${params.userName},</p>

      <p>Félicitations ! Vous êtes maintenant inscrit(e) à une nouvelle formation gratuite.</p>

      <div class="course-info">
        <div class="course-name">${params.courseName}</div>
        <div style="color: #10b981; font-weight: bold; font-size: 18px;">Gratuit</div>
      </div>

      <p><strong>Prêt(e) à commencer ?</strong></p>
      <ul>
        <li>Suivez les modules à votre rythme</li>
        <li>Accédez à toutes les ressources</li>
        <li>Interagissez avec la communauté</li>
      </ul>

      <center>
        <a href="${params.courseUrl}" class="cta-button">
          Commencer maintenant
        </a>
      </center>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        💡 <strong>Astuce :</strong> Explorez notre catalogue pour découvrir d'autres formations qui pourraient vous intéresser !
      </p>
    </div>

    <div class="footer">
      <p>Vous avez reçu cet email car vous vous êtes inscrit(e) à une formation sur SkillForge.</p>
      <p>Des questions ? Répondez simplement à cet email.</p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} SkillForge - Tous droits réservés
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Template notification créateur
 */
function getNewEnrollmentTemplate(params: NewEnrollmentNotificationEmail): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle inscription</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    h1 {
      color: #8b5cf6;
      margin: 0;
      font-size: 28px;
    }
    .notification-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .content {
      margin-bottom: 30px;
    }
    .enrollment-info {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .student-name {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .course-name {
      color: #666;
      margin-bottom: 10px;
    }
    .revenue {
      font-size: 24px;
      font-weight: bold;
      color: #10b981;
    }
    .cta-button {
      display: inline-block;
      background-color: #8b5cf6;
      color: white;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="notification-icon">🎊</div>
      <h1>Nouvelle inscription !</h1>
    </div>

    <div class="content">
      <p>Bonjour ${params.creatorName},</p>

      <p>Excellente nouvelle ! Un nouvel étudiant vient de s'inscrire à votre formation.</p>

      <div class="enrollment-info">
        <div class="student-name">${params.studentName}</div>
        <div class="course-name">${params.courseName}</div>
        ${params.price > 0 ? `<div class="revenue">+${params.price}€ de revenus</div>` : '<div style="color: #10b981; font-weight: bold;">Inscription gratuite</div>'}
      </div>

      <p><strong>Continuez comme ça !</strong></p>
      <ul>
        <li>Répondez aux questions de vos étudiants</li>
        <li>Consultez les statistiques de votre cours</li>
        <li>Améliorez votre contenu en continu</li>
      </ul>

      <center>
        <a href="${params.courseUrl}" class="cta-button">
          Voir mon cours
        </a>
      </center>
    </div>

    <div class="footer">
      <p>Vous avez reçu cet email car vous êtes créateur sur SkillForge.</p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} SkillForge - Tous droits réservés
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
