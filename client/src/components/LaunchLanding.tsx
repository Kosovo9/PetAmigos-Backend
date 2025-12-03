'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function LaunchLanding() {
    const [isVisible, setIsVisible] = useState(false); // Starts hidden
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
    const [isExpired, setIsExpired] = useState(false);
    const starsContainerRef = useRef<HTMLDivElement>(null);

    // Star background effect (Optimized)
    useEffect(() => {
        if (starsContainerRef.current && starsContainerRef.current.childElementCount === 0) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = Math.random() * 2 + 1;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.left = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 5}s`;
                fragment.appendChild(star);
            }
            starsContainerRef.current.appendChild(fragment);
        }
    }, []);

    // Countdown timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-open modal after 2 seconds (optional, as per your script comment)
        const autoOpen = setTimeout(() => setIsVisible(true), 2000);

        return () => {
            clearInterval(timer);
            clearTimeout(autoOpen);
        };
    }, []);

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const openModal = () => setIsVisible(true);
    const closeModal = () => setIsVisible(false);

    return (
        <>
            <style jsx global>{`
        /* --- ESTILOS GENERALES Y OPTIMIZACIÓN --- */
        :root {
            --purple-dark: #4a1a7f; --purple-light: #8e2de2; --yellow-gold: #ffd700;
            --blue-dark: #0d324d; --blue-light: #1a7f91; --cyan-light: #98f5e1;
            --bg-dark: #0c0a1a; --text-light: #ffffff; --text-muted: rgba(255, 255, 255, 0.7 );
        }
        body {
            font-family: 'Poppins', sans-serif; margin: 0; background-color: var(--bg-dark);
            color: var(--text-light); overflow-x: hidden;
        }
        .stars-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .star { position: absolute; background-color: var(--text-light); border-radius: 50%; animation: twinkle 5s infinite ease-in-out; will-change: opacity; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

        /* --- BARRA DE NAVEGACIÓN Y TOOLTIPS --- */
        .main-header {
            display: flex; justify-content: space-between; align-items: center; padding: 15px 30px;
            background: rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: fixed; top: 0; width: 100%; z-index: 900; box-sizing: border-box;
        }
        .logo { font-size: 1.5em; font-weight: 700; }
        .main-nav { display: flex; gap: 10px; }
        .nav-link {
            color: #e0e0e0; text-decoration: none; padding: 5px 10px; transition: color 0.3s;
            position: relative; /* Requerido para el tooltip */
        }
        .nav-link:hover { color: var(--yellow-gold); }
        /* Estilo del Tooltip */
        .nav-link[data-tooltip]::after {
            content: attr(data-tooltip); position: absolute; left: 50%; top: 120%;
            transform: translateX(-50%); background-color: #333; color: #fff; padding: 5px 10px;
            border-radius: 5px; font-size: 12px; white-space: nowrap;
            opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s; will-change: opacity;
        }
        .nav-link[data-tooltip]:hover::after { opacity: 1; visibility: visible; }

        .user-actions .btn { border-radius: 20px; cursor: pointer; padding: 8px 16px; font-weight: 600; border: none; }
        .user-actions .btn-login { background: none; border: 1px solid var(--text-light); color: var(--text-light); }
        .user-actions .btn-main { background: var(--yellow-gold); color: var(--purple-dark); margin-left: 10px; }

        /* --- CONTENEDOR DEL MODAL (OVERLAY) --- */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10, 8, 20, 0.7); backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center; z-index: 1000;
            opacity: 0; visibility: hidden; transition: opacity 0.4s, visibility 0.4s; will-change: opacity;
        }
        .modal-overlay.visible { opacity: 1; visibility: visible; }

        /* --- ESTRUCTURA Y ANIMACIONES DEL MODAL --- */
        .modal-container {
            border-radius: 24px; padding: 40px; width: 90%; max-width: 520px;
            text-align: center; position: relative; border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            transform: scale(0.9); transition: transform 0.4s; will-change: transform;
        }
        .modal-overlay.visible .modal-container { transform: scale(1); }

        /* --- TEMAS DE COLOR --- */
        .theme-purple { background: linear-gradient(145deg, var(--purple-dark), var(--purple-light)); }
        .theme-purple .modal-subtitle, .theme-purple .timer-box span { color: var(--yellow-gold); }
        .theme-purple .cta-button { background-color: var(--yellow-gold); color: var(--purple-dark); animation: pulse-yellow 2s infinite; }
        
        /* --- CONTENIDO DEL MODAL --- */
        .close-button { position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--text-light); font-size: 28px; cursor: pointer; opacity: 0.7; transition: all 0.3s; z-index: 10; }
        .close-button:hover { opacity: 1; transform: rotate(90deg); }
        .modal-icon { font-size: 48px; margin-bottom: 10px; }
        .modal-title { font-size: 28px; font-weight: 700; margin: 0; color: #f0e6ff; }
        .modal-subtitle { font-size: 18px; font-weight: 600; margin: 5px 0 15px 0; }
        .modal-description { font-size: 16px; margin: 0 0 25px 0; line-height: 1.6; color: #e0d8f5; }
        .modal-limit-text { font-size: 13px; color: var(--text-muted); margin-top: 20px; }

        /* --- TEMPORIZADOR --- */
        .countdown-timer { display: flex; justify-content: center; gap: 15px; margin: 25px 0; }
        .timer-box { background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 8px; width: 70px; }
        .timer-box span { font-size: 24px; font-weight: 700; }
        .timer-box p { font-size: 12px; margin: 0; color: var(--text-muted); }

        /* --- BOTÓN CTA Y ANIMACIONES DE PULSO --- */
        .cta-button { border: none; border-radius: 50px; padding: 15px 35px; font-size: 18px; font-weight: 700; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; display: inline-flex; align-items: center; gap: 10px; will-change: transform; }
        .cta-button:hover { transform: translateY(-3px); animation-play-state: paused; }
        .cta-button .icon { font-size: 20px; }
        @keyframes pulse-yellow { 0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(255, 215, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); } }

        /* --- DISEÑO RESPONSIVO --- */
        @media (max-width: 768px) {
            .main-nav { display: none; }
            .logo { font-size: 1.2em; }
            .modal-container { padding: 30px 20px; }
            .modal-title { font-size: 24px; }
            .timer-box { width: 60px; }
            .cta-button { padding: 12px 28px; font-size: 16px; }
        }
      `}</style>

            <div className="stars-background" ref={starsContainerRef}></div>

            <header className="main-header">
                <div className="logo">PetMatch.fun</div>
                <nav className="main-nav">
                    <a href="#" className="nav-link" data-tooltip="Crea imágenes únicas de tus mascotas">Studio</a>
                    <a href="#" className="nav-link" data-tooltip="Habla con otros amantes de las mascotas">Chat</a>
                    <a href="#" className="nav-link" data-tooltip="Organiza paseos en grupo">Paseos</a>
                    <a href="#" className="nav-link" data-tooltip="Comparte momentos especiales">Historias</a>
                </nav>
                <div className="user-actions">
                    <button className="btn btn-login">Iniciar Sesión</button>
                    <button className="btn btn-main open-modal-button" onClick={openModal}>Empezar Gratis</button>
                </div>
            </header>

            <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
                <div className="modal-container theme-purple">
                    <button className="close-button" onClick={closeModal}>&times;</button>

                    {!isExpired ? (
                        <div id="modal-content-active">
                            <div className="modal-icon">🎁</div>
                            <h1 className="modal-title">¡LANZAMIENTO ESPECIAL!</h1>
                            <p className="modal-subtitle">La oferta termina en:</p>
                            <div className="countdown-timer">
                                <div className="timer-box"><span>{hours.toString().padStart(2, '0')}</span><p>Horas</p></div>
                                <div className="timer-box"><span>{minutes.toString().padStart(2, '0')}</span><p>Minutos</p></div>
                                <div className="timer-box"><span>{seconds.toString().padStart(2, '0')}</span><p>Segundos</p></div>
                            </div>
                            <p className="modal-description">¡Te regalamos 3 Fotos con IA para celebrar nuestro lanzamiento!</p>
                            <button className="cta-button"><span className="icon">✨</span> Reclamar Mis Fotos Gratis</button>
                            <p className="modal-limit-text">Limitado a 3 fotos por persona.</p>
                        </div>
                    ) : (
                        <div id="modal-content-expired">
                            <div className="modal-icon">😞</div>
                            <h1 className="modal-title">¡Oferta Terminada!</h1>
                            <p className="modal-description" style={{ marginTop: '20px' }}>
                                La oferta de lanzamiento ha finalizado. ¡Síguenos para no perderte futuras promociones!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
