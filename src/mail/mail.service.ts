import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  // configService: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT) || 587,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  /**
   * Méthode universelle d'envoi d'email
   */
  async send(options: EmailOptions): Promise<void> {
    try {
      const html = this.renderTemplate(options.template, options.data);

      const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS || 'noreply@ticketer.com',
        to: options.to,
        subject: options.subject,
        html: html,
        text: this.stripHtml(html),
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Erreur lors de l'envoi du mail: ${error.message}`);
      throw error;
    }
  }

  /**
   * Rendu des templates
   */
  private renderTemplate(
    templateName: string,
    data: Record<string, any>,
  ): string {
    const templates: Record<string, string> = {
      welcome: this.welcomeTemplate(data as any),
      emailVerification: this.emailVerificationTemplate(data as any),
      passwordReset: this.passwordResetTemplate(data as any),
      bookingConfirmation: this.bookingConfirmationTemplate(data as any),
      // concertNotification: this.concertNotificationTemplate(data as any),
      ticketPurchase: this.ticketPurchaseTemplate(data as any),
    };

    if (!templates[templateName]) {
      throw new Error(`Template "${templateName}" not found`);
    }

    return templates[templateName];
  }

  /**
   * TEMPLATE 1: Email de bienvenue
   */
  private welcomeTemplate(data: { username: string; email: string }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">🎉 Bienvenue sur TICKETER!</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Salut <strong>${data.username}</strong>,
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Merci de t'être inscrit! Tu peux maintenant:
          </p>
          <ul style="color: #666; font-size: 16px; line-height: 1.8;">
            <li>📅 Consulter les concerts à venir</li>
            <li>🎤 Découvrir tes artistes préférés</li>
            <li>🎟️ Réserver tes places facilement</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL}/login" 
               style="background-color: #4f46e5; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Se connecter maintenant
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            TICKETER © 2025 - Tous les concerts en un seul endroit
          </p>
        </div>
      </div>
    `;
  }

  /**
   * TEMPLATE 2: Email de réinitialisation mot de passe
   */
  private passwordResetTemplate(data: {
    username: string;
    resetLink: string;
    expiresIn?: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #f59e0b; margin-bottom: 20px;">🔐 Réinitialiser votre mot de passe</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Bonjour <strong>${data.username}</strong>,
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Vous avez demandé la réinitialisation de votre mot de passe.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" 
               style="background-color: #f59e0b; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
              Réinitialiser le mot de passe
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">
            ⏰ Ce lien expire dans ${data.expiresIn || '1 heure'}.
          </p>
          <p style="color: #999; font-size: 12px;">
            Si vous n'avez pas demandé cela, ignorez simplement cet email.
          </p>
        </div>
      </div>
    `;
  }

  /**
   * TEMPLATE 3: Confirmation de réservation
   */
  private bookingConfirmationTemplate(data: {
    username: string;
    concertName: string;
    date: string;
    location: string;
    ticketCount: number;
    bookingId: string;
    totalPrice: number;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #10b981; margin-bottom: 20px;">🎟️ Réservation Confirmée!</h2>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Merci <strong>${data.username}</strong>!
          </p>
          <div style="background: #f3f4f6; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #1f2937; margin-top: 0;">📋 Détails de la réservation</h3>
            <p><strong>Concert:</strong> ${data.concertName}</p>
            <p><strong>📅 Date:</strong> ${data.date}</p>
            <p><strong>📍 Lieu:</strong> ${data.location}</p>
            <p><strong>🎫 Nombre de places:</strong> ${data.ticketCount}</p>
            <p style="font-size: 18px; color: #10b981;"><strong>💰 Total: ${data.totalPrice}€</strong></p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * TEMPLATE 5: Confirmation d'achat de billets
   */
  private ticketPurchaseTemplate(data: {
    username: string;
    ticketType: string;
    quantity: number;
    price: number;
    purchaseId: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h2 style="color: #ec4899; margin-bottom: 20px;">🎫 Achat de Billets Confirmé!</h2>
          <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <p><strong>Type de billet:</strong> ${data.ticketType}</p>
            <p><strong>Quantité:</strong> ${data.quantity}</p>
            <p><strong>Prix unitaire:</strong> ${data.price}€</p>
            <p style="font-size: 18px; color: #ec4899;"><strong>Total: ${data.quantity * data.price}€</strong></p>
          </div>
        </div>
      </div>
    `;
  }

  private emailVerificationTemplate(data: {
    username: string;
    verificationLink: string;
  }): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">Vérifiez votre email</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Bienvenue <strong>${data.username}</strong>!
        </p>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          Pour activer votre compte TICKETER, cliquez sur le lien ci-dessous:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background-color: #4f46e5; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Vérifier mon email
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">
          ⏰ Ce lien expire dans 24 heures.
        </p>
      </div>
    </div>
  `;
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Connexion mail réussie!');
      return true;
    } catch (error) {
      console.error('Erreur de connexion mail:', error.message);
      return false;
    }
  }

  async sendConcertNotification(userEmail: string, concert: any) {
    const mailOptions = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      from: process.env.MAIL_FROM_ADDRESS || 'noreply@ticketer.com',
      to: userEmail,
      subject: `Nouvelle alerte de CONCERT: ${concert.title}`,
      html: `
      <h2>YTon artiste favorie à un concert!</h2>
      <p>BOnne nouvelle! Un nouveau concert à été planifier:</p>
      <h3>${concert.title}</h3>
      <p><strong>Date:</strong> ${new Date(concert.date).toLocaleDateString()}</p>
      <p><strong>Lieu:</strong> ${concert.location}</p>
      <p><strong>Pri:</strong> $${concert.price}</p>
      <p><a href="https://military-rory-epitech-c96fb691.koyeb.app/concerts/view/${concert._id}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Details</a></p>
    `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Concert notification sent to ${userEmail}`);
    } catch (error) {
      console.error(`Error sending notification to ${userEmail}:`, error);
    }
  }
}
