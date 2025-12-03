import Link from 'next/link';
import {
    Heart,
    MapPin,
    Plane,
    MessageCircle,
    Camera,
    Leaf,
    Users,
    DollarSign,
    Stethoscope,
    AlertCircle
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section - Transparente para ver el fondo cósmico */}
            <section className="relative bg-black/30 backdrop-blur-sm text-white py-32 px-4 border-b border-white/10">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <h1 className="text-6xl md:text-8xl font-black mb-6 animate-fade-in drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                            🐾 PetMatch.fun
                        </h1>
                        <p className="text-2xl md:text-4xl mb-4 text-white/90 font-light tracking-wide">
                            La Super App Galáctica para tu Mascota
                        </p>
                        <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto font-mono">
                            Chat en tiempo real • Fotos con IA • Alertas de mascotas perdidas • Paseos verificados
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/christmas"
                                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-10 py-5 rounded-full font-bold hover:scale-110 transition-all shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-400"
                            >
                                🎄 Fotos Navideñas con IA
                            </Link>
                            <Link
                                href="/chat"
                                className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full font-bold hover:bg-white/20 transition-all border border-white/30 hover:scale-105"
                            >
                                💬 Abrir Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid - Glassmorphism */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
                        🌟 10 Features Increíbles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1: Chat Messenger */}
                        <Link href="/chat" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-purple-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                                    <MessageCircle className="w-7 h-7 text-purple-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Chat Messenger</h3>
                                <p className="text-gray-300 text-sm">
                                    Chat en tiempo real tipo Facebook. Envía mensajes, fotos, ubicación y pagos.
                                </p>
                                <div className="mt-4 text-purple-400 font-semibold text-sm group-hover:text-purple-300">
                                    Abrir Chat →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 2: Mascotas Perdidas */}
                        <Link href="/lost-pets" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-red-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                                    <AlertCircle className="w-7 h-7 text-red-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Alerta Mascotas Perdidas</h3>
                                <p className="text-gray-300 text-sm">
                                    Geolocalización en tiempo real. Alerta a usuarios cercanos en 5km.
                                </p>
                                <div className="mt-4 text-red-400 font-semibold text-sm group-hover:text-red-300">
                                    Crear Alerta →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 3: Paseos Verificados */}
                        <Link href="/app/en/dog-walking/miami" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-green-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                                    <MapPin className="w-7 h-7 text-green-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Paseos Verificados</h3>
                                <p className="text-gray-300 text-sm">
                                    Walkers con verificación biométrica. Tracking GPS en vivo.
                                </p>
                                <div className="mt-4 text-green-400 font-semibold text-sm group-hover:text-green-300">
                                    Reservar Paseo →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 4: Nutrición AI */}
                        <Link href="/app/en/nutrition/miami" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-orange-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                                    <Stethoscope className="w-7 h-7 text-orange-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Nutrición AI</h3>
                                <p className="text-gray-300 text-sm">
                                    Plan personalizado con IA. Recetas semanales gratis.
                                </p>
                                <div className="mt-4 text-orange-400 font-semibold text-sm group-hover:text-orange-300">
                                    Ver Plan →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 5: AI Photo Studio */}
                        <Link href="/christmas" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-pink-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
                                    <Camera className="w-7 h-7 text-pink-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">AI Photo Studio</h3>
                                <p className="text-gray-300 text-sm">
                                    Fotos profesionales con IA. Navidad, cumpleaños y más.
                                </p>
                                <div className="mt-4 text-pink-400 font-semibold text-sm group-hover:text-pink-300">
                                    Generar Fotos →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 6: PetMatch Fly */}
                        <Link href="/fly" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-blue-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                                    <Plane className="w-7 h-7 text-blue-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">PetMatch Fly</h3>
                                <p className="text-gray-300 text-sm">
                                    Políticas de 50+ aerolíneas. Precios y requisitos actualizados.
                                </p>
                                <div className="mt-4 text-blue-400 font-semibold text-sm group-hover:text-blue-300">
                                    Ver Aerolíneas →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 7: ESG Carbon */}
                        <Link href="/app/en/carbon-offset/miami" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-emerald-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                                    <Leaf className="w-7 h-7 text-emerald-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Huella de Carbono</h3>
                                <p className="text-gray-300 text-sm">
                                    Calcula el impacto ambiental. Compensa con árboles.
                                </p>
                                <div className="mt-4 text-emerald-400 font-semibold text-sm group-hover:text-emerald-300">
                                    Calcular →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 8: Influencers */}
                        <Link href="/affiliates" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-indigo-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
                                    <Users className="w-7 h-7 text-indigo-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Microinfluencers</h3>
                                <p className="text-gray-300 text-sm">
                                    Gana 30% de comisión. Dashboard de ventas en tiempo real.
                                </p>
                                <div className="mt-4 text-indigo-400 font-semibold text-sm group-hover:text-indigo-300">
                                    Ver Dashboard →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 9: Love Stories */}
                        <Link href="/love-stories" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-rose-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-rose-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-500 transition-colors">
                                    <Heart className="w-7 h-7 text-rose-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Love Stories</h3>
                                <p className="text-gray-300 text-sm">
                                    Historias de adopción verificadas. Comparte tu experiencia.
                                </p>
                                <div className="mt-4 text-rose-400 font-semibold text-sm group-hover:text-rose-300">
                                    Ver Historias →
                                </div>
                            </div>
                        </Link>

                        {/* Feature 10: Veterinarias */}
                        <Link href="/app/en/veterinary/miami" className="group">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/10 hover:border-cyan-400 group-hover:bg-black/40">
                                <div className="w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500 transition-colors">
                                    <DollarSign className="w-7 h-7 text-cyan-300 group-hover:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">Veterinarias</h3>
                                <p className="text-gray-300 text-sm">
                                    Directorio verificado. Booking con telemedicina integrada.
                                </p>
                                <div className="mt-4 text-cyan-400 font-semibold text-sm group-hover:text-cyan-300">
                                    Buscar Veterinaria →
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md text-white border-y border-white/10">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">
                        ¿Listo para comenzar?
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Únete a miles de dueños de mascotas que confían en PetMatch
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-block bg-white text-purple-900 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all text-lg transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                        Ver Planes
                    </Link>
                </div>
            </section>

            {/* Payment Footer */}
            <footer className="w-full bg-black/90 backdrop-blur-md border-t border-white/10 py-12">
                <div className="container mx-auto px-4">
                    {/* Logos de Pago */}
                    <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-10 md:h-12 hover:scale-110 transition-transform brightness-100" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-10 md:h-12 hover:scale-110 transition-transform brightness-100" />
                        <a href="https://link.mercadopago.com.mx/studionexora" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-xl@2x.png" alt="Mercado Pago" className="h-10 md:h-12 brightness-100 bg-yellow-400 px-3 py-1 rounded" />
                        </a>
                        <a href="https://studionexora.lemonsqueezy.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="https://assets.lemonsqueezy.com/media/2022/05/03023647/lemon-squeezy-logo-white.svg" alt="Lemon Squeezy" className="h-8 md:h-10 brightness-100" />
                        </a>
                    </div>

                    <div className="text-center text-gray-600 text-xs">
                        © 2025 PetMatch.fun - Todos los derechos reservados
                    </div>
                </div>
            </footer>
        </div>
    );
}
