import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title?: string;
    description?: string;
    canonical?: string;
    image?: string;
    lang?: string;
    type?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
    title = "PetAmigos – The AI-Powered Global Pet Social Network",
    description = "Connect with pet lovers worldwide. Report lost pets instantly, chat with AI-powered pets, send virtual treats, and support animal welfare – all in one platform.",
    canonical = "https://petmatch-global.netlify.app",
    image = "https://petmatch-global.netlify.app/og-image.jpg",
    lang = "en",
    type = "website"
}) => {
    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <html lang={lang} />
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonical} />
            <meta property="og:site_name" content="PetAmigos" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data / JSON-LD for Search Engines */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "PetAmigos",
                    "url": "https://petmatch-global.netlify.app",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://petmatch-global.netlify.app/search?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SeoHead;
