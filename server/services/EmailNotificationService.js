const nodemailer = require('nodemailer');

// Configurar transporter (usa tus credenciales SMTP reales)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 📧 NOTIFICACIÓN DE NUEVA VENTA
exports.sendSaleNotification = async (affiliateEmail, saleData) => {
    try {
        const mailOptions = {
            from: '"PetMatch Affiliates" <affiliates@petmatch.fun>',
            to: affiliateEmail,
            subject: '💰 ¡Nueva Venta Registrada!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
                    <h1 style="color: #22c55e; font-size: 32px; margin-bottom: 20px;">¡Felicidades! 🎉</h1>
                    <p style="font-size: 18px; color: #ccc; margin-bottom: 30px;">
                        Has generado una nueva venta a través de tu enlace de afiliado.
                    </p>
                    
                    <div style="background: #111; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>Monto de Venta:</strong> $${saleData.amount}</p>
                        <p style="margin: 10px 0;"><strong>Tu Comisión:</strong> <span style="color: #22c55e; font-size: 24px; font-weight: bold;">$${saleData.commission}</span></p>
                        <p style="margin: 10px 0;"><strong>Código Usado:</strong> ${saleData.code}</p>
                        <p style="margin: 10px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>

                    <a href="https://petmatch.fun/affiliates/dashboard" style="display: inline-block; background: #22c55e; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;">
                        Ver Mi Dashboard
                    </a>

                    <p style="color: #666; font-size: 12px; margin-top: 40px;">
                        Este es un correo automático. No respondas a este mensaje.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de venta enviado a ${affiliateEmail}`);
    } catch (error) {
        console.error('Error enviando email de venta:', error);
    }
};

// 💸 NOTIFICACIÓN DE PAGO PROCESADO
exports.sendPayoutNotification = async (affiliateEmail, payoutData) => {
    try {
        const mailOptions = {
            from: '"PetMatch Affiliates" <affiliates@petmatch.fun>',
            to: affiliateEmail,
            subject: '💸 Tu Pago ha sido Procesado',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
                    <h1 style="color: #22c55e; font-size: 32px; margin-bottom: 20px;">¡Pago Enviado! 💸</h1>
                    <p style="font-size: 18px; color: #ccc; margin-bottom: 30px;">
                        Tu solicitud de pago ha sido procesada exitosamente.
                    </p>
                    
                    <div style="background: #111; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>Monto:</strong> <span style="color: #22c55e; font-size: 24px; font-weight: bold;">$${payoutData.amount}</span></p>
                        <p style="margin: 10px 0;"><strong>Método:</strong> ${payoutData.method}</p>
                        <p style="margin: 10px 0;"><strong>Fecha de Procesamiento:</strong> ${new Date().toLocaleDateString()}</p>
                        <p style="margin: 10px 0;"><strong>Tiempo Estimado de Llegada:</strong> 3-5 días hábiles</p>
                    </div>

                    <p style="color: #ccc; margin-top: 30px;">
                        El dinero debería aparecer en tu cuenta pronto. Si tienes alguna pregunta, contáctanos en support@petmatch.fun
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de pago enviado a ${affiliateEmail}`);
    } catch (error) {
        console.error('Error enviando email de pago:', error);
    }
};

// 🎯 NOTIFICACIÓN DE NUEVO TIER
exports.sendTierUpgradeNotification = async (affiliateEmail, tierData) => {
    try {
        const mailOptions = {
            from: '"PetMatch Affiliates" <affiliates@petmatch.fun>',
            to: affiliateEmail,
            subject: `🏆 ¡Subiste a ${tierData.newTier.toUpperCase()}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
                    <h1 style="color: #fbbf24; font-size: 32px; margin-bottom: 20px;">¡Felicidades! 🏆</h1>
                    <p style="font-size: 18px; color: #ccc; margin-bottom: 30px;">
                        Has alcanzado el nivel <strong style="color: #fbbf24;">${tierData.newTier.toUpperCase()}</strong> en nuestro programa de afiliados.
                    </p>
                    
                    <div style="background: #111; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>Nuevos Beneficios:</strong></p>
                        <ul style="color: #22c55e;">
                            ${tierData.benefits.map(b => `<li>${b}</li>`).join('')}
                        </ul>
                    </div>

                    <a href="https://petmatch.fun/affiliates/dashboard" style="display: inline-block; background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;">
                        Ver Mi Dashboard
                    </a>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de tier upgrade enviado a ${affiliateEmail}`);
    } catch (error) {
        console.error('Error enviando email de tier:', error);
    }
};

module.exports = {
    sendSaleNotification,
    sendPayoutNotification,
    sendTierUpgradeNotification
};
