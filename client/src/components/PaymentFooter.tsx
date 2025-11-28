'use client';

import React from 'react';

export default function PaymentFooter() {
    return (
        <footer className="w-full bg-black/80 backdrop-blur-md border-t border-white/10 py-12 mt-20">
            <div className="container mx-auto px-4">

                {/* Logos de Pago */}
                <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8 md:h-10 invert" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 md:h-10" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8 md:h-10 invert" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 md:h-10" />
                    {/* Lemon Squeezy (Texto estilizado si no hay logo público estable) */}
                    <div className="flex items-center gap-2 font-bold text-white text-xl">
                        <span className="text-yellow-400">🍋</span> Lemon Squeezy
                    </div>
                </div>

                {/* Disclaimer Multilingüe */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-gray-400 border-t border-white/10 pt-8">

                    {/* English */}
                    <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            🇺🇸 LEGAL DISCLAIMER
                        </h4>
                        <p>
                            PetMatch AI Studio uses advanced artificial intelligence to generate artistic representations.
                            Results may vary based on input quality. All payments are processed securely via Stripe/PayPal.
                            By using this service, you agree to our Terms of Service and Privacy Policy.
                            Not affiliated with Santa Claus (officially).
                        </p>
                    </div>

                    {/* Español */}
                    <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            🇲🇽 AVISO LEGAL
                        </h4>
                        <p>
                            PetMatch AI Studio utiliza inteligencia artificial avanzada para generar representaciones artísticas.
                            Los resultados pueden variar según la calidad de entrada. Todos los pagos se procesan de forma segura vía Stripe/PayPal.
                            Al usar este servicio, aceptas nuestros Términos de Servicio y Política de Privacidad.
                            No afiliado oficialmente con Santa Claus.
                        </p>
                    </div>

                    {/* Français */}
                    <div>
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                            🇫🇷 MENTIONS LÉGALES
                        </h4>
                        <p>
                            PetMatch AI Studio utilise une intelligence artificielle avancée pour générer des représentations artistiques.
                            Les résultats peuvent varier en fonction de la qualité de l'entrée. Tous les paiements sont traités en toute sécurité via Stripe/PayPal.
                            En utilisant ce service, vous acceptez nos Conditions d'Utilisation et notre Politique de Confidentialité.
                            Non affilié officiellement au Père Noël.
                        </p>
                    </div>

                </div>

                <div className="text-center text-gray-600 text-xs mt-12">
                    © 2025 PetMatch World. All rights reserved. Quantum Speed Deployment.
                </div>
            </div>
        </footer>
    );
}
