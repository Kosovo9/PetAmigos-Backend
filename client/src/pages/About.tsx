
import React from 'react';
import SeoHead from '../components/SeoHead';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Globe, Shield, Heart } from 'lucide-react';

const About: React.FC = () => {
    // Datos de tu organización (ajusta según tu país: Chihuahua, México)
    const organization = {
        name: "PetAmigos",
        legalName: "PetAmigos Global",
        url: "https://petmatch-global.netlify.app",
        logo: "https://petmatch-global.netlify.app/logo-512.png",
        founders: [
            {
                name: "Your Name",
                jobTitle: "Founder & CEO"
            }
        ],
        address: {
            streetAddress: "Av. Tecnologico",
            addressLocality: "Chihuahua",
            addressRegion: "CHIH",
            postalCode: "31000",
            addressCountry: "MX"
        },
        contactPoint: {
            telephone: "+52-614-555-0123",
            contactType: "customer service"
        },
        sameAs: [
            "https://twitter.com/petamigos",
            "https://facebook.com/petamigos",
            "https://instagram.com/petamigos"
        ]
    };

    // Schema AEO Organization
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": organization.name,
        "legalName": organization.legalName,
        "url": organization.url,
        "logo": organization.logo,
        "founders": organization.founders.map(founder => ({
            "@type": "Person",
            "name": founder.name,
            "jobTitle": founder.jobTitle
        })),
        "address": {
            "@type": "PostalAddress",
            ...organization.address
        },
        "contactPoint": {
            "@type": "ContactPoint",
            ...organization.contactPoint
        },
        "sameAs": organization.sameAs
    };

    return (
        <div className="min-h-screen bg-white">
            <SeoHead
                title="About Us - PetAmigos Global"
                description="We are building the world's most advanced AI-powered social network for pets. Connecting pet lovers globally from Chihuahua, Mexico."
                canonical="https://petmatch-global.netlify.app/about"
            />

            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(organizationSchema)}
                </script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
                    >
                        Connecting Pets Globally
                    </motion.h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        From Chihuahua to the world, we are revolutionizing how pet owners connect, share, and protect their furry friends.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="pt-6">
                        <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                        <Globe className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Global Reach</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    Connecting pet communities across borders with seamless translation and local discovery.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-pink-500 rounded-md shadow-lg">
                                        <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Pet Welfare</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    AI-powered health tips and instant Amber Alerts to keep every pet safe and healthy.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                                        <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Privacy First</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    Military-grade encryption for all your data. Your location and chats are always secure.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                            <div className="-mt-6">
                                <div>
                                    <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                                        <Users className="h-6 w-6 text-white" aria-hidden="true" />
                                    </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Community Driven</h3>
                                <p className="mt-5 text-base text-gray-500">
                                    Built by pet lovers, for pet lovers. We listen to our community to shape the future.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team / Founders section could go here */}

                {/* Contact */}
                <div className="mt-16 bg-indigo-700 rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
                    <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                        <div className="lg:self-center">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                <span className="block">Ready to join?</span>
                                <span className="block">Download the app today.</span>
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-indigo-200">
                                Join thousands of happy pets and owners in the fastest growing pet network.
                            </p>
                            <a href="/register" className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50">
                                Sign up for free
                            </a>
                        </div>
                    </div>
                    <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
                        <img
                            className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="App screenshot"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
