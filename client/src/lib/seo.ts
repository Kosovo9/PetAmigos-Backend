import { Metadata } from 'next';

interface SEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
}

/**
 * Generate dynamic metadata for any page
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
    const baseUrl = 'https://www.petmatch.fun';
    const {
        title,
        description,
        keywords = [],
        image = '/og-image.jpg',
        url = baseUrl,
        type = 'website',
        publishedTime,
        modifiedTime,
        author,
    } = config;

    const fullTitle = title.includes('PetMatch') ? title : `${title} | PetMatch AI`;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

    const metadata: Metadata = {
        title: fullTitle,
        description,
        keywords: keywords.length > 0 ? keywords : undefined,
        openGraph: {
            title: fullTitle,
            description,
            url: fullUrl,
            siteName: 'PetMatch AI',
            images: [
                {
                    url: fullImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
            locale: 'en_US',
            type,
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && type === 'article' && {
                authors: [author]
            }),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [fullImageUrl],
            creator: '@petmatchai',
            site: '@petmatchai',
        },
        alternates: {
            canonical: fullUrl,
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
    };

    return metadata;
}

/**
 * Generate JSON-LD structured data for articles/blog posts
 */
export function generateArticleSchema(config: {
    title: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    image: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: config.title,
        description: config.description,
        image: config.image,
        datePublished: config.publishedTime,
        dateModified: config.modifiedTime || config.publishedTime,
        author: {
            '@type': 'Person',
            name: config.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'PetMatch AI',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.petmatch.fun/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': config.url,
        },
    };
}

/**
 * Generate JSON-LD structured data for products/services
 */
export function generateProductSchema(config: {
    name: string;
    description: string;
    image: string;
    price: string;
    currency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    rating?: number;
    reviewCount?: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: config.name,
        description: config.description,
        image: config.image,
        offers: {
            '@type': 'Offer',
            price: config.price,
            priceCurrency: config.currency,
            availability: `https://schema.org/${config.availability}`,
        },
        ...(config.rating && config.reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: config.rating,
                reviewCount: config.reviewCount,
                bestRating: 5,
                worstRating: 1,
            },
        }),
    };
}

/**
 * Generate JSON-LD structured data for local business/service
 */
export function generateLocalBusinessSchema(config: {
    name: string;
    description: string;
    address: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    phone?: string;
    priceRange?: string;
    rating?: number;
    reviewCount?: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: config.name,
        description: config.description,
        address: {
            '@type': 'PostalAddress',
            ...config.address,
        },
        ...(config.phone && { telephone: config.phone }),
        ...(config.priceRange && { priceRange: config.priceRange }),
        ...(config.rating && config.reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: config.rating,
                reviewCount: config.reviewCount,
                bestRating: 5,
                worstRating: 1,
            },
        }),
    };
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
