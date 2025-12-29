
// server/utils/webPush.js
import webPush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

// Genera tus claves VAPID una vez (guárdalas en .env)
// npx web-push generate-vapid-keys

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(
        'mailto:admin@petamigos.org',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export default webPush;
