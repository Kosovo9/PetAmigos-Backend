import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://www.petmatch.fun'),
    title: {
        default: 'PetMatch AI - Hyper-Realistic Pet Photos with AI | LinkedIn & Social Media',
        template: '%s | PetMatch AI'
    },
    description: 'Create stunning, hyper-realistic AI photos of you and your pets for LinkedIn, Facebook, Instagram. Professional headshots, lifestyle shots, and Christmas portraits. 8K quality, Hollywood-grade results in seconds. Chat with pet lovers, find lost pets, book verified dog walkers, and more.',
    keywords: [
        // Core AI Photo Keywords
        'AI pet photos',
        'pet photography AI',
        'AI photo generator',
        'pet portrait AI',
        'hyper-realistic pet images',
        'AI headshot generator',
        'AI image generation',

        // Professional Use Cases
        'LinkedIn headshot with pet',
        'professional pet photos',
        'professional pet photography',
        'business headshot with dog',
        'corporate photo with pet',

        // Social Media
        'Instagram pet photos',
        'Facebook pet pictures',
        'social media pet photos',
        'viral pet content',

        // Seasonal & Special
        'Christmas pet photos',
        'holiday pet portraits',
        'pet birthday photos',
        'seasonal pet photography',

        // Services
        'dog walking service',
        'pet chat messenger',
        'lost pet alert',
        'pet GPS tracking',
        'pet nutrition AI',
        'pet travel guide',
        'fly with pet',
        'pet veterinary booking',

        // Quality & Features
        '8K pet photos',
        'realistic pet portraits',
        'pet photo editing',
        'instant pet photos',
        'pet and owner photos',

        // Location-based
        'pet services Miami',
        'dog walker New York',
        'pet care app',
        'pet super app',
    ],
    authors: [{ name: 'PetMatch AI Team' }],
    creator: 'PetMatch AI',
    publisher: 'PetMatch AI',
    applicationName: 'PetMatch AI',
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
        title: 'PetMatch AI - Hyper-Realistic Pet Photos with AI | The Ultimate Pet Super App',
        description: 'Create stunning, hyper-realistic AI photos of you and your pets. Perfect for LinkedIn, Facebook, Instagram. 8K quality, Hollywood-grade results. Plus chat, lost pet alerts, dog walking, and 10+ features.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'PetMatch AI - Professional Pet Photography & Services',
                type: 'image/jpeg',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@petmatchai',
        creator: '@petmatchai',
        title: 'PetMatch AI - Hyper-Realistic Pet Photos with AI',
        description: 'Create stunning AI photos of you and your pets. Perfect for LinkedIn & social media. 8K quality in seconds. Chat, lost pet alerts, dog walking & more!',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
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
            'en': 'https://www.petmatch.fun/en',
            'es': 'https://www.petmatch.fun/es',
            'pt': 'https://www.petmatch.fun/pt',
            'de': 'https://www.petmatch.fun/de',
            'it': 'https://www.petmatch.fun/it',
            'zh': 'https://www.petmatch.fun/zh',
            'ja': 'https://www.petmatch.fun/ja',
            'fr': 'https://www.petmatch.fun/fr',
            'ru': 'https://www.petmatch.fun/ru',
            'ko': 'https://www.petmatch.fun/ko',
        },
    },
    category: 'technology',
    classification: 'Pet Services, AI Technology, Social Network',
    other: {
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },
};

export default metadata;
