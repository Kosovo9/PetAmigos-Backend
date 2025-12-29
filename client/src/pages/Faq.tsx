import React from 'react';
import SeoHead from '../components/SeoHead';
import { motion } from 'framer-motion';
import { ChevronDown, MessageCircle, AlertTriangle, Gift } from 'lucide-react';

const Faq: React.FC = () => {
    const faqs = [
        {
            question: "How does the AI pet chat work?",
            answer: "PetAmigos uses OpenAI's GPT-4o-mini to simulate realistic conversations with your virtual pet. You can train it with your real pet’s personality, breed, and age, and it responds in real time using secure API calls.",
            icon: MessageCircle
        },
        {
            question: "How do I report a lost pet?",
            answer: "Our 'Lost Pet Alert' system uses geolocation to instantly notify all PetAmigos users within a specific radius. You can upload photos, last known location, and contact details to speed up the reunion.",
            icon: AlertTriangle
        },
        {
            question: "What are virtual treats?",
            answer: "Virtual treats are digital gifts you can send to other pets on the platform. They serve as a fun way to interact and show appreciation for cute or helpful posts within the community.",
            icon: Gift
        },
        {
            question: "Is PetAmigos free to use?",
            answer: "Yes, PetAmigos is free to join. We offer premium features for advanced AI interactions and boosted lost pet alerts, but the core social features are available to everyone."
        }
    ];

    // AEO - Structured Data for FAQ
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <SeoHead
                title="FAQ - PetAmigos AI Pet Social Network"
                description="Frequently asked questions about PetAmigos. Learn about AI pet chat, lost pet alerts, and our global pet community."
                canonical="https://petmatch-global.netlify.app/faq"
            />

            {/* Inject AEO Schema */}
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about PetAmigos
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {faq.icon && (
                                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                                            <faq.icon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Faq;
