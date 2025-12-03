'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function PaymentFooter() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <footer className="w-full bg-black/90 backdrop-blur-md border-t border-white/10 py-12 mt-20">
            <div className="container mx-auto px-4">

                {/* Logos de Pago - EN COLOR (Sin filtros) */}
                <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
                    {/* 1. Stripe */}
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                        alt="Stripe"
                        className="h-10 md:h-12 hover:scale-110 transition-transform brightness-100"
                    />

                    {/* 2. PayPal */}
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                        alt="PayPal"
                        className="h-10 md:h-12 hover:scale-110 transition-transform brightness-100"
                    />

                    {/* 3. Mercado Pago */}
                    <img
                        src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-xl@2x.png"
                        alt="Mercado Pago"
                        className="h-10 md:h-12 hover:scale-110 transition-transform brightness-100 bg-yellow-400 px-3 py-1 rounded"
                    />

                    {/* 4. Lemon Squeezy */}
                    <img
                        src="https://assets.lemonsqueezy.com/media/2022/05/03023647/lemon-squeezy-logo-white.svg"
                        alt="Lemon Squeezy"
                        className="h-8 md:h-10 hover:scale-110 transition-transform brightness-100"
                    />
                </div>

                {/* Disclaimer SOLO EN EL IDIOMA ACTUAL */}
                <div className="max-w-3xl mx-auto text-center text-xs text-gray-400 border-t border-white/10 pt-8">
                    {locale === 'en' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇺🇸 LEGAL DISCLAIMER
                            </h4>
                            <p>
                                PetMatch AI Studio uses advanced artificial intelligence. Results may vary based on input quality.
                                Payments are securely processed via Stripe, PayPal, Mercado Pago, and Lemon Squeezy.
                                Not officially affiliated with Santa Claus or any holiday characters.
                            </p>
                        </>
                    )}

                    {locale === 'es' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇲🇽 AVISO LEGAL
                            </h4>
                            <p>
                                PetMatch AI Studio utiliza inteligencia artificial avanzada. Los resultados pueden variar según la calidad de entrada.
                                Los pagos se procesan de forma segura a través de Stripe, PayPal, Mercado Pago y Lemon Squeezy.
                                No afiliado oficialmente con Santa Claus o personajes navideños.
                            </p>
                        </>
                    )}

                    {locale === 'pt' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇧🇷 AVISO LEGAL
                            </h4>
                            <p>
                                PetMatch AI Studio usa inteligência artificial avançada. Os resultados podem variar com base na qualidade de entrada.
                                Os pagamentos são processados com segurança via Stripe, PayPal, Mercado Pago e Lemon Squeezy.
                                Não afiliado oficialmente ao Papai Noel ou personagens natalinos.
                            </p>
                        </>
                    )}

                    {locale === 'de' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇩🇪 RECHTLICHER HINWEIS
                            </h4>
                            <p>
                                PetMatch AI Studio verwendet fortgeschrittene künstliche Intelligenz. Die Ergebnisse können je nach Eingabequalität variieren.
                                Zahlungen werden sicher über Stripe, PayPal, Mercado Pago und Lemon Squeezy verarbeitet.
                                Nicht offiziell mit dem Weihnachtsmann oder Weihnachtsfiguren verbunden.
                            </p>
                        </>
                    )}

                    {locale === 'it' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇮🇹 NOTE LEGALI
                            </h4>
                            <p>
                                PetMatch AI Studio utilizza intelligenza artificiale avanzata. I risultati possono variare in base alla qualità dell'input.
                                I pagamenti vengono elaborati in modo sicuro tramite Stripe, PayPal, Mercado Pago e Lemon Squeezy.
                                Non ufficialmente affiliato a Babbo Natale o personaggi natalizi.
                            </p>
                        </>
                    )}

                    {locale === 'zh' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇨🇳 法律免责声明
                            </h4>
                            <p>
                                PetMatch AI Studio 使用先进的人工智能。结果可能因输入质量而异。
                                付款通过 Stripe、PayPal、Mercado Pago 和 Lemon Squeezy 安全处理。
                                与圣诞老人或节日人物无官方关联。
                            </p>
                        </>
                    )}

                    {locale === 'ja' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇯🇵 法的免責事項
                            </h4>
                            <p>
                                PetMatch AI Studioは高度な人工知能を使用しています。結果は入力品質によって異なる場合があります。
                                支払いはStripe、PayPal、Mercado Pago、Lemon Squeezyを通じて安全に処理されます。
                                サンタクロースや休日のキャラクターとは公式に関係ありません。
                            </p>
                        </>
                    )}

                    {locale === 'fr' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇫🇷 MENTIONS LÉGALES
                            </h4>
                            <p>
                                PetMatch AI Studio utilise une intelligence artificielle avancée. Les résultats peuvent varier en fonction de la qualité de l'entrée.
                                Les paiements sont traités en toute sécurité via Stripe, PayPal, Mercado Pago et Lemon Squeezy.
                                Non officiellement affilié au Père Noël ou aux personnages de vacances.
                            </p>
                        </>
                    )}

                    {locale === 'ru' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇷🇺 ЮРИДИЧЕСКАЯ ОГОВОРКА
                            </h4>
                            <p>
                                PetMatch AI Studio использует передовой искусственный интеллект. Результаты могут варьироваться в зависимости от качества ввода.
                                Платежи безопасно обрабатываются через Stripe, PayPal, Mercado Pago и Lemon Squeezy.
                                Не официально связан с Дедом Морозом или праздничными персонажами.
                            </p>
                        </>
                    )}

                    {locale === 'ko' && (
                        <>
                            <h4 className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                                🇰🇷 법적 고지사항
                            </h4>
                            <p>
                                PetMatch AI Studio는 고급 인공지능을 사용합니다. 결과는 입력 품질에 따라 달라질 수 있습니다.
                                결제는 Stripe, PayPal, Mercado Pago 및 Lemon Squeezy를 통해 안전하게 처리됩니다.
                                산타클로스나 휴일 캐릭터와 공식적으로 제휴하지 않습니다.
                            </p>
                        </>
                    )}
                </div>

                <div className="text-center text-gray-600 text-xs mt-8">
                    © 2025 PetMatch World. All rights reserved. Quantum Speed Deployment.
                </div>
            </div>
        </footer>
    );
}
