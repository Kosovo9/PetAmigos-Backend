import Link from 'next/link';
import { Camera, Heart, MapPin, MessageCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* NO BANNER - Clean Version v2.0 */}

            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-purple-900/50 to-transparent text-white py-32 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <div className="mb-4 inline-block px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                        <span className="text-green-300 font-mono text-sm">✅ v2.0-NO-BANNER | LIVE</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fade-in drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                        🐾 PetMatch.fun
                    </h1>

                    <p className="text-2xl md:text-4xl mb-4 text-white/90 font-light">
                        AI-Powered Pet Photo Studio
                    </p>

                    <p className="text-lg mb-12 text-white/70 max-w-2xl mx-auto">
                        Create hyper-realistic photos of you and your pets with AI. Perfect for LinkedIn, social media & more.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/prompts"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold hover:scale-110 transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                        >
                            <Sparkles className="inline-block w-5 h-5 mr-2" />
                            Browse Prompts
                        </Link>

                        <Link
                            href="/pricing"
                            className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full font-bold hover:bg-white/20 transition-all border border-white/30"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-12 text-white">
                        ✨ Premium Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <Link href="/prompts" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-pink-400">
                                <div className="w-14 h-14 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
                                    <Camera className="w-7 h-7 text-pink-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">AI Photo Studio</h3>
                                <p className="text-gray-300 text-sm">
                                    Hyper-realistic photos with AI. LinkedIn, Christmas & more.
                                </p>
                            </div>
                        </Link>

                        {/* Feature 2 */}
                        <Link href="/chat" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-purple-400">
                                <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                                    <MessageCircle className="w-7 h-7 text-purple-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Real-Time Chat</h3>
                                <p className="text-gray-300 text-sm">
                                    Connect with pet lovers. Share photos, tips & more.
                                </p>
                            </div>
                        </Link>

                        {/* Feature 3 */}
                        <Link href="/love-stories" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-rose-400">
                                <div className="w-14 h-14 bg-rose-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-500 transition-colors">
                                    <Heart className="w-7 h-7 text-rose-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Love Stories</h3>
                                <p className="text-gray-300 text-sm">
                                    Read heartwarming adoption stories from our community.
                                </p>
                            </div>
                        </Link>

                        {/* Feature 4 */}
                        <Link href="/walks" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-green-400">
                                <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                                    <MapPin className="w-7 h-7 text-green-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Verified Walks</h3>
                                <p className="text-gray-300 text-sm">
                                    Book verified pet walkers with GPS tracking.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Join thousands of pet owners creating amazing AI photos
                    </p>
                    <Link
                        href="/prompts"
                        className="inline-block bg-white text-purple-900 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all text-lg transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                        Browse Prompt Library
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black/90 text-white/40 py-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm">
                        © {new Date().getFullYear()} PetMatch.Fun. All rights reserved. <span className="text-green-400 font-mono">v2.0-NO-BANNER</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/refunds" className="hover:text-white transition-colors">Refunds</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
