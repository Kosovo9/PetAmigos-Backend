import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.petmatch.fun'),
    title: {
        default: 'PetMatch AI - Hyper-Realistic Pet Photos with AI | LinkedIn & Social Media',
        template: '%s | PetMatch AI'
    },
    description: 'Create stunning, hyper-realistic AI photos of you and your pets for LinkedIn, Facebook, Instagram. Professional headshots, lifestyle shots, and Christmas portraits. 8K quality, Hollywood-grade results in seconds.',
    keywords: [
        'AI pet photos',
        'pet photography AI',
        'LinkedIn headshot with pet',
        'professional pet photos',
        'AI photo generator',
        'pet portrait AI',
        'Christmas pet photos',
        'social media pet photos',
        'hyper-realistic pet images',
        'AI headshot generator',
        'pet and owner photos',
        'professional pet photography',
        'AI image generation',
        'pet photo editing',
        'realistic pet portraits'
    ],
    authors: [{ name: 'PetMatch AI Team' }],
    creator: 'PetMatch AI',
    publisher: 'PetMatch AI',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://www.petmatch.fun',
        siteName: 'PetMatch AI',
        title: 'PetMatch AI - Hyper-Realistic Pet Photos with AI',
        description: 'Create stunning, hyper-realistic AI photos of you and your pets. Perfect for LinkedIn, Facebook, Instagram. 8K quality, Hollywood-grade results.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'PetMatch AI - Professional Pet Photography',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PetMatch AI - Hyper-Realistic Pet Photos with AI',
        description: 'Create stunning AI photos of you and your pets. Perfect for LinkedIn & social media. 8K quality in seconds.',
        images: ['/og-image.jpg'],
        creator: '@petmatchai',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
        other: {
            bing: 'your-bing-verification-code',
        },
    },
    alternates: {
        canonical: 'https://www.petmatch.fun',
        languages: {
            'en-US': 'https://www.petmatch.fun/en',
            'es-ES': 'https://www.petmatch.fun/es',
            'pt-BR': 'https://www.petmatch.fun/pt',
            'de-DE': 'https://www.petmatch.fun/de',
            'it-IT': 'https://www.petmatch.fun/it',
            'zh-CN': 'https://www.petmatch.fun/zh',
            'ja-JP': 'https://www.petmatch.fun/ja',
            'fr-FR': 'https://www.petmatch.fun/fr',
            'ru-RU': 'https://www.petmatch.fun/ru',
            'ko-KR': 'https://www.petmatch.fun/ko',
        },
    },
    category: 'technology',
};

export default metadata;
