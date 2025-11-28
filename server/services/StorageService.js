const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// 📦 STORAGE SERVICE - MULTI-PROVIDER
// Prioridad: Supabase (500MB gratis) → Cloudflare R2 (10GB gratis) → GitHub (ilimitado)

class StorageService {

    constructor() {
        // Supabase client
        if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
            this.supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_KEY
            );
        }
    }

    // 📤 SUBIR A SUPABASE (PRINCIPAL)
    async uploadToSupabase(imageData, userId) {
        try {
            if (!this.supabase) {
                throw new Error('Supabase not configured');
            }

            console.log('📤 Subiendo a Supabase Storage...');

            // Convertir base64 a buffer si es necesario
            let buffer;
            if (imageData.startsWith('data:image')) {
                const base64Data = imageData.split(',')[1];
                buffer = Buffer.from(base64Data, 'base64');
            } else {
                buffer = imageData;
            }

            const fileName = `${userId}/${Date.now()}.jpg`;

            const { data, error } = await this.supabase.storage
                .from('pet-photos')
                .upload(fileName, buffer, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Obtener URL pública
            const { data: { publicUrl } } = this.supabase.storage
                .from('pet-photos')
                .getPublicUrl(fileName);

            console.log('✅ Imagen subida a Supabase:', publicUrl);

            return publicUrl;

        } catch (error) {
            console.error('❌ Supabase upload falló:', error.message);
            throw error;
        }
    }

    // ☁️ SUBIR A CLOUDFLARE R2 (FALLBACK)
    async uploadToCloudflareR2(imageData, userId) {
        try {
            console.log('☁️ Subiendo a Cloudflare R2...');

            const fileName = `${userId}/${Date.now()}.jpg`;
            const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/r2/buckets/pet-photos/objects/${fileName}`;

            let buffer;
            if (imageData.startsWith('data:image')) {
                const base64Data = imageData.split(',')[1];
                buffer = Buffer.from(base64Data, 'base64');
            } else {
                buffer = imageData;
            }

            await axios.put(endpoint, buffer, {
                headers: {
                    'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
                    'Content-Type': 'image/jpeg'
                }
            });

            const publicUrl = `https://photos.petmatch.fun/${fileName}`;

            console.log('✅ Imagen subida a Cloudflare R2:', publicUrl);

            return publicUrl;

        } catch (error) {
            console.error('❌ Cloudflare R2 upload falló:', error.message);
            throw error;
        }
    }

    // 🐙 SUBIR A GITHUB (ÚLTIMO FALLBACK - ILIMITADO)
    async uploadToGitHub(imageData, userId) {
        try {
            console.log('🐙 Subiendo a GitHub (fallback)...');

            const fileName = `${userId}/${Date.now()}.jpg`;

            let base64Data;
            if (imageData.startsWith('data:image')) {
                base64Data = imageData.split(',')[1];
            } else {
                base64Data = Buffer.from(imageData).toString('base64');
            }

            const response = await axios.put(
                `https://api.github.com/repos/${process.env.GITHUB_REPO_OWNER}/petmatch-photos/contents/${fileName}`,
                {
                    message: `Add photo for user ${userId}`,
                    content: base64Data,
                    branch: 'main'
                },
                {
                    headers: {
                        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const publicUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_REPO_OWNER}/petmatch-photos/main/${fileName}`;

            console.log('✅ Imagen subida a GitHub:', publicUrl);

            return publicUrl;

        } catch (error) {
            console.error('❌ GitHub upload falló:', error.message);
            throw error;
        }
    }

    // 🎯 MÉTODO PRINCIPAL CON FALLBACK AUTOMÁTICO
    async upload(imageData, userId) {
        const providers = ['supabase', 'cloudflare', 'github'];

        for (const provider of providers) {
            try {
                let url;

                switch (provider) {
                    case 'supabase':
                        url = await this.uploadToSupabase(imageData, userId);
                        break;
                    case 'cloudflare':
                        url = await this.uploadToCloudflareR2(imageData, userId);
                        break;
                    case 'github':
                        url = await this.uploadToGitHub(imageData, userId);
                        break;
                }

                if (url) {
                    console.log(`✅ Upload exitoso con ${provider}`);
                    return url;
                }

            } catch (error) {
                console.log(`⚠️ ${provider} falló, intentando siguiente provider...`);
                continue;
            }
        }

        throw new Error('Todos los storage providers fallaron');
    }
}

// Exportar instancia singleton
const storageService = new StorageService();

module.exports = {
    uploadToSupabase: (imageData, userId) => storageService.upload(imageData, userId),
    StorageService
};
