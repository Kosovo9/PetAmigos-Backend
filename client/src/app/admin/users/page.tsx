'use client';

import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Shield, Star, User as UserIcon } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 w-64 focus:w-80 transition-all"
                    />
                </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Rol</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Créditos</th>
                                <th className="px-6 py-4">Fecha Registro</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                        Cargando usuarios...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold border border-white/10">
                                                    {user.name?.charAt(0) || <UserIcon size={16} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' || user.role === 'superadmin' ? (
                                                <span className="flex items-center gap-1 text-purple-400 font-bold text-xs bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 w-fit">
                                                    <Shield size={12} /> ADMIN
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Usuario</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isPremium ? (
                                                <span className="flex items-center gap-1 text-yellow-400 font-bold text-xs bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 w-fit">
                                                    <Star size={12} /> PREMIUM
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded">FREE</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">
                                            {user.credits || 0}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Página {page} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
