const nodemailer = require('nodemailer');

/**
 * 📧 EMAIL SERVICE - PetMatch.Fun
 * Corporate email management using Outlook/Hotmail
 */

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // Use TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        // Corporate email addresses
        this.emails = {
            contact: process.env.CONTACT_EMAIL || 'contacto.petmatch@hotmail.com',
            sales: process.env.SALES_EMAIL || 'ventas.petmatch@hotmail.com',
            support: process.env.SUPPORT_EMAIL || 'soporte.petmatch@hotmail.com',
            affiliates: process.env.AFFILIATES_EMAIL || 'afiliados.petmatch@hotmail.com',
            admin: process.env.SMTP_USER || 'admin.petmatch@hotmail.com'
        };
    }

    /**
     * Verify SMTP connection
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ SMTP connection verified');
            return true;
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    }

    /**
     * Send welcome email to new user
     */
    async sendWelcomeEmail(user) {
        const html = this.getWelcomeTemplate(user);

        return this.send({
            to: user.email,
            from: this.emails.contact,
            subject: '🎉 ¡Bienvenido a PetMatch.Fun!',
            html
        });
    }

    /**
     * Send password reset email
     */
    async sendPasswordReset(user, resetToken) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        const html = this.getPasswordResetTemplate(user, resetUrl);

        return this.send({
            to: user.email,
            from: this.emails.support,
            subject: '🔒 Recupera tu contraseña - PetMatch.Fun',
            html
        });
    }

    /**
     * Send payment confirmation
     */
    async sendPaymentConfirmation(user, transaction) {
        const html = this.getPaymentTemplate(user, transaction);

        return this.send({
            to: user.email,
            from: this.emails.sales,
            subject: '💳 Confirmación de Pago - PetMatch.Fun',
            html
        });
    }

    /**
     * Send referral reward notification
     */
    async sendReferralReward(user, reward) {
        const html = this.getReferralRewardTemplate(user, reward);

        return this.send({
            to: user.email,
            from: this.emails.affiliates,
            subject: '🎁 ¡Has ganado créditos por referir!',
            html
        });
    }

    /**
     * Send admin notification
     */
    async sendAdminNotification(subject, message, data = {}) {
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #8b5cf6;">🔔 Notificación Admin - PetMatch.Fun</h2>
                    <p><strong>Asunto:</strong> ${subject}</p>
                    <p>${message}</p>
                    <pre style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto;">
${JSON.stringify(data, null, 2)}
                    </pre>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        Enviado automáticamente desde PetMatch Backend
                    </p>
                </div>
            </div>
        `;

        return this.send({
            to: this.emails.admin,
            from: this.emails.admin,
            subject: `[ADMIN] ${subject}`,
            html
        });
    }

    /**
     * Core send function
     */
    async send({ to, from, subject, html, text }) {
        try {
            if (!process.env.SMTP_USER) {
                console.warn('⚠️ SMTP not configured. Email not sent.');
                return { success: false, message: 'SMTP not configured' };
            }

            const info = await this.transporter.sendMail({
                from: `PetMatch.Fun <${from}>`,
                to,
                subject,
                html,
                text: text || this.stripHtml(html)
            });

            console.log(`✅ Email sent: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Strip HTML tags for plain text version
     */
    stripHtml(html) {
        return html.replace(/<[^>]*>?/gm, '');
    }

    // ============ EMAIL TEMPLATES ============

    getWelcomeTemplate(user) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <div style="padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 36px;">🎉 ¡Bienvenido!</h1>
            <p style="font-size: 18px; margin-top: 10px;">¡Hola ${user.name || 'amigo'}!</p>
        </div>
        
        <div style="background-color: white; padding: 40px; border-radius: 20px 20px 0 0;">
            <h2 style="color: #667eea; margin-top: 0;">¡Gracias por unirte a PetMatch.Fun! 🐾</h2>
            
            <p style="color: #333; line-height: 1.6;">
                Estamos emocionados de tenerte en nuestra comunidad. Con PetMatch puedes:
            </p>
            
            <ul style="color: #555; line-height: 1.8;">
                <li>📸 Generar fotos increíbles con IA de tu mascota</li>
                <li>❤️ Compartir historias de amor y adopción</li>
                <li>🎁 Ganar créditos refiriendo amigos</li>
                <li>🧬 Crear el Digital Twin de tu mascota</li>
                <li>✈️ Consultar políticas de vuelo para viajar con tu pet</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">
                    Ir a mi Dashboard
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
                ¿Necesitas ayuda? Escríbenos a <a href="mailto:${this.emails.support}" style="color: #667eea;">${this.emails.support}</a>
            </p>
        </div>
    </div>
</body>
</html>
        `;
    }

    getPasswordResetTemplate(user, resetUrl) {
        return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0;">🔒 Recupera tu Contraseña</h1>
        </div>
        
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #333;">Hola ${user.name || 'usuario'},</p>
            
            <p style="color: #555; line-height: 1.6;">
                Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background-color: #f5576c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    Restablecer Contraseña
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                Si no solicitaste este cambio, ignora este correo. El enlace expira en 1 hora.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                También puedes copiar y pegar este enlace en tu navegador:<br>
                <a href="${resetUrl}" style="color: #f5576c; word-break: break-all;">${resetUrl}</a>
            </p>
        </div>
    </div>
</body>
</html>
        `;
    }

    getPaymentTemplate(user, transaction) {
        return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0;">✅ Pago Confirmado</h1>
        </div>
        
        <div style="padding: 40px;">
            <p style="font-size: 16px; color: #333;">¡Gracias ${user.name}!</p>
            
            <p style="color: #555; line-height: 1.6;">
                Tu pago ha sido procesado exitosamente. Aquí están los detalles:
            </p>
            
            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; color: #666;">Monto:</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #11998e;">
                            $${transaction.amount} ${transaction.currency || 'USD'}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666;">Plan:</td>
                        <td style="padding: 10px 0; text-align: right; font-weight: bold;">
                            ${transaction.plan || 'Premium'}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666;">ID de Transacción:</td>
                        <td style="padding: 10px 0; text-align: right; font-family: monospace; font-size: 12px;">
                            ${transaction.id}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #666;">Fecha:</td>
                        <td style="padding: 10px 0; text-align: right;">
                            ${new Date().toLocaleDateString('es-MX')}
                        </td>
                    </tr>
                </table>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
                Tu cuenta Premium está activa. ¡Disfruta de todos los beneficios!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/dashboard" style="display: inline-block; background-color: #11998e; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    Ver mi Dashboard
                </a>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    getReferralRewardTemplate(user, reward) {
        return `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0;">🎁 ¡Ganaste Créditos!</h1>
        </div>
        
        <div style="padding: 40px; text-align: center;">
            <p style="font-size: 18px; color: #333;">¡Felicidades ${user.name}!</p>
            
            <div style="margin: 30px 0;">
                <div style="display: inline-block; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 20px 40px; border-radius: 15px;">
                    <div style="font-size: 14px; opacity: 0.9;">Ganaste</div>
                    <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">${reward.credits}</div>
                    <div style="font-size: 14px; opacity: 0.9;">créditos</div>
                </div>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
                ${reward.message || 'Gracias por compartir PetMatch con tus amigos. ¡Sigue refiriendo para ganar más!'}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/dashboard/referrals" style="display: inline-block; background-color: #fa709a; color: white; padding: 15px 40px; text-decoration: none; border-radius: 30px; font-weight: bold;">
                    Ver mi Panel de Referidos
                </a>
            </div>
            
            <div style="background-color: #fff8e1; padding: 15px; border-radius: 10px; margin-top: 30px;">
                <p style="margin: 0; color: #f57c00; font-size: 14px;">
                    💡 <strong>Tip:</strong> Comparte tu código en redes sociales para ganar aún más créditos.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }
}

// Export singleton instance
const emailService = new EmailService();
module.exports = emailService;
