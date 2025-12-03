'use client';

import React, { useState } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LAUNCH_MESSAGES = {
    en: {
        title: "🎉 GRAND LAUNCH SPECIAL!",
        subtitle: "24 Hours Free Access",
        description: "We're going live! Get 3 FREE AI Photos to celebrate.",
        cta: "Claim Your Free Photos",
        label_name: "First Name",
        label_lastname: "Last Name",
        label_email: "Email",
        countdown: "Offer ends in:",
        terms: "Limited to 3 photos per person during launch period"
    },
    es: {
        title: "🎉 ¡LANZAMIENTO ESPECIAL!",
        subtitle: "24 Horas Acceso Gratis",
        description: "¡Estamos saliendo al aire! 3 Fotos con IA GRATIS para celebrar.",
        cta: "Reclamar Mis Fotos Gratis",
        label_name: "Nombre",
        label_lastname: "Apellido",
        label_email: "Correo",
        countdown: "La oferta termina en:",
        terms: "Limitado a 3 fotos por persona durante el lanzamiento"
    },
    pt: {
        title: "🎉 LANÇAMENTO ESPECIAL!",
        subtitle: "24 Horas Acesso Grátis",
        description: "Estamos no ar! 3 Fotos com IA GRÁTIS para comemorar.",
        cta: "Reivindicar Minhas Fotos",
        label_name: "Nome",
        label_lastname: "Sobrenome",
        label_email: "Email",
        countdown: "Oferta termina em:",
        terms: "Limitado a 3 fotos por pessoa durante o lançamento"
    },
    fr: {
        title: "🎉 LANCEMENT SPÉCIAL!",
        subtitle: "24 Heures Accès Gratuit",
        description: "On est en ligne! 3 Photos IA GRATUITES pour célébrer.",
        cta: "Réclamer Mes Photos",
        label_name: "Prénom",
        label_lastname: "Nom",
        label_email: "Email",
        countdown: "L'offre se termine dans:",
        terms: "Limité à 3 photos par personne pendant le lancement"
    },
    de: {
        title: "🎉 LAUNCH SPECIAL!",
        subtitle: "24 Stunden Gratis",
        description: "Wir starten! 3 KOSTENLOSE KI-Fotos zur Feier.",
        cta: "Fotos Anfordern",
        label_name: "Vorname",
        label_lastname: "Nachname",
        label_email: "E-Mail",
        countdown: "Angebot endet in:",
        terms: "Begrenzt auf 3 Fotos pro Person während des Starts"
    },
    it: {
        title: "🎉 LANCIO SPECIALE!",
        subtitle: "24 Ore Accesso Gratis",
        description: "Siamo online! 3 Foto IA GRATIS per festeggiare.",
        cta: "Richiedi Le Mie Foto",
        label_name: "Nome",
        label_lastname: "Cognome",
        label_email: "Email",
        countdown: "L'offerta termina tra:",
        terms: "Limitato a 3 foto per persona durante il lancio"
    },
    ja: {
        title: "🎉 ローンチ特別!",
        subtitle: "24時間無料アクセス",
        description: "公開中！お祝いに3枚のAI写真無料。",
        cta: "無料写真を請求",
        label_name: "名",
        label_lastname: "姓",
        label_email: "メール",
        countdown: "オファー終了まで:",
        terms: "開始期間中、1人あたり3枚の写真に制限"
    },
    ko: {
        title: "🎉 출시 특별!",
        subtitle: "24시간 무료 액세스",
        description: "출시 중! 축하하기 위해 3장의 AI 사진 무료.",
        cta: "무료 사진 받기",
        label_name: "이름",
        label_lastname: "성",
        label_email: "이메일",
        countdown: "제안 종료:",
        terms: "출시 기간 동안 1인당 3장의 사진으로 제한"
    },
    ru: {
        title: "🎉 ЗАПУСК СПЕЦИАЛЬНЫЙ!",
        subtitle: "24 Часа Бесплатно",
        description: "Мы в эфире! 3 БЕСПЛАТНЫХ AI фото для празднования.",
        cta: "Получить Мои Фото",
        label_name: "Имя",
        label_lastname: "Фамилия",
        label_email: "Email",
        countdown: "Предложение заканчивается через:",
        terms: "Ограничено 3 фотографиями на человека в период запуска"
    },
    zh: {
        title: "🎉 启动特惠！",
        subtitle: "24小时免费访问",
        description: "我们上线了！庆祝获得3张免费AI照片。",
        cta: "领取我的照片",
        label_name: "名字",
        label_lastname: "姓氏",
        label_email: "电子邮件",
        countdown: "优惠结束于:",
        terms: "启动期间每人限3张照片"
    }
};

export default function LaunchBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', lastname: '', email: '' });
    const [locale, setLocale] = useState('en');

    // Detectar idioma del navegador
    React.useEffect(() => {
        const browserLang = navigator.language.split('-')[0];
        if (LAUNCH_MESSAGES[browserLang]) {
            setLocale(browserLang);
        }
    }, []);

    const t = LAUNCH_MESSAGES[locale];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guardar en localStorage
        localStorage.setItem('launch_user', JSON.stringify({
            ...formData,
            photosRemaining: 3,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));

        // Cerrar banner
        setIsVisible(false);

        // Redirect a generación
        window.location.href = '/christmas';
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-20 left-0 right-0 z-50 px-4 py-2"
            >
                <div className="container mx-auto max-w-4xl">
                    <div className="relative bg-gradient-to-r from-purple-900/95 via-pink-900/95 to-red-900/95 backdrop-blur-xl rounded-2xl border-2 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] p-6">
                        {/* Close button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {!showForm ? (
                            <div className="text-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-block mb-4"
                                >
                                    <Gift className="w-16 h-16 text-yellow-400" />
                                </motion.div>

                                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                                    {t.title}
                                </h2>
                                <p className="text-xl text-yellow-300 font-bold mb-3">
                                    {t.subtitle}
                                </p>
                                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                                    {t.description}
                                </p>

                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(250,204,21,0.6)] flex items-center gap-2 mx-auto"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    {t.cta}
                                </button>

                                <p className="text-xs text-white/60 mt-4">
                                    {t.terms}
                                </p>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                                    {t.cta}
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder={t.label_name}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                                    />

                                    <input
                                        type="text"
                                        placeholder={t.label_lastname}
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        required
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                                    />

                                    <input
                                        type="email"
                                        placeholder={t.label_email}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                                    />

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg"
                                    >
                                        🎉 {t.cta}
                                    </button>
                                </form>

                                <p className="text-xs text-white/60 mt-4 text-center">
                                    {t.terms}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
