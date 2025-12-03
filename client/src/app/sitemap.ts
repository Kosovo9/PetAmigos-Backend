import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.petmatch.fun'

    // Supported languages
    const languages = ['en', 'es', 'pt', 'de', 'it', 'zh', 'ja', 'fr', 'ru', 'ko']

    // Main cities for services
    const cities = ['miami', 'new-york', 'los-angeles', 'chicago', 'houston', 'cdmx', 'barcelona', 'madrid']

    // Services available
    const services = ['dog-walking', 'nutrition', 'veterinary', 'carbon-offset']

    const routes: MetadataRoute.Sitemap = [
        // Homepage - Highest priority
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },

        // Core features - High priority
        {
            url: `${baseUrl}/christmas`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/prompts`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/love-stories`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/chat`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/lost-pets`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/fly`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/affiliates`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
        },

        // Legal pages - Lower priority
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    // Add service pages for each city and language
    services.forEach(service => {
        cities.forEach(city => {
            languages.forEach(lang => {
                routes.push({
                    url: `${baseUrl}/app/${lang}/${service}/${city}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                })
            })
        })
    })

    // Add language-specific home pages
    languages.forEach(lang => {
        routes.push({
            url: `${baseUrl}/${lang}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        })
    })

    return routes
}
