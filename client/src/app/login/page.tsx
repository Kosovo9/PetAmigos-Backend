'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = login(email, password);

            if (success) {
                // Redirigir según rol
                const user = JSON.parse(localStorage.getItem('current_user') || '{}');
                if (user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else if (user.role === 'advertiser') {
                    router.push('/advertiser/dashboard');
                } else if (user.role === 'shelter') {
                    router.push('/shelter/dashboard');
                } else {
                    router.push('/');
                }
            } else {
                setError('Credenciales inválidas. Usa: demo@petmatch.com / demo123');
            }
        } catch (err) {
            setError('Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">PetMatch</h1>
                        <p className="text-gray-600 mt-2">Inicia sesión en tu dashboard</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Demo credentials */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 mb-2">🎯 Credenciales de Demo:</p>
                        <div className="space-y-1 text-xs text-blue-800">
                            <p><strong>Admin:</strong> admin@petmatch.com / demo123</p>
                            <p><strong>Anunciante:</strong> advertiser@example.com / demo123</p>
                            <p><strong>Refugio:</strong> shelter@example.com / demo123</p>
                        </div>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Regístrate aquí
                        </a>
                    </p>
                </div>

                {/* Quick links */}
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    {[
                        { email: 'admin@petmatch.com', label: 'Admin', role: 'admin' },
                        { email: 'advertiser@example.com', label: 'Anunciante', role: 'advertiser' },
                        { email: 'shelter@example.com', label: 'Refugio', role: 'shelter' },
                    ].map((quick) => (
                        <button
                            key={quick.role}
                            onClick={() => {
                                setEmail(quick.email);
                                setPassword('demo123');
                            }}
                            className="px-3 py-2 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                        >
                            {quick.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
