'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, MapPin, DollarSign, Image, MoreVertical, Phone, Video, Search, ArrowLeft } from 'lucide-react';
import { apiEndpoint } from '@/lib/config';
import { motion } from 'framer-motion';

export default function ChatPage() {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

    // Fetch conversations (Simulated for now)
    useEffect(() => {
        setConversations([
            { id: 1, name: 'Walker Juan', lastMessage: 'Llegué con Max!', time: '10:30 AM', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', online: true },
            { id: 2, name: 'Dra. Sarah Vet', lastMessage: 'Cita confirmada para el martes', time: 'Ayer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', online: false },
            { id: 3, name: 'PetShop Elite', lastMessage: 'Tu pedido ha sido enviado 📦', time: 'Lun', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', online: true }
        ]);

        setMessages([
            { id: 1, text: 'Hola! Ya voy en camino por Max 🐕', sender: 'them', time: '10:30 AM' },
            { id: 2, text: 'Perfecto! Gracias 😊', sender: 'me', time: '10:31 AM' },
            { id: 3, text: 'Llegué! Está muy contento hoy.', sender: 'them', time: '10:45 AM', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&q=80' },
        ]);
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        // Optimistic update
        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
        setNewMessage('');

        // TODO: Real API call
    };

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-7xl h-screen flex relative z-10 p-4 gap-4">
                {/* Sidebar - Conversations List */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`w-full md:w-1/3 lg:w-1/4 bg-[#111] border border-white/10 rounded-3xl flex flex-col overflow-hidden ${activeChat !== null ? 'hidden md:flex' : 'flex'}`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
                        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                            PetMatch Chat
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar conversaciones..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {conversations.map((conv: any) => (
                            <motion.div
                                key={conv.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setActiveChat(conv.id)}
                                className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${activeChat === conv.id
                                        ? 'bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30'
                                        : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="relative">
                                    <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                                    {conv.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-bold truncate ${activeChat === conv.id ? 'text-white' : 'text-gray-300'}`}>
                                            {conv.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">{conv.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Main Chat Area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex-1 bg-[#111] border border-white/10 rounded-3xl flex flex-col overflow-hidden ${activeChat === null ? 'hidden md:flex' : 'flex'}`}
                >
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setActiveChat(null)}
                                        className="md:hidden p-2 hover:bg-white/10 rounded-full text-gray-400"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative">
                                        <img
                                            src={conversations.find((c: any) => c.id === activeChat)?.avatar}
                                            alt="Avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#111]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">
                                            {conversations.find((c: any) => c.id === activeChat)?.name}
                                        </h3>
                                        <p className="text-xs text-green-400 font-mono">● EN LÍNEA</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-pink-400 transition-colors">
                                        <Phone size={20} />
                                    </button>
                                    <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-pink-400 transition-colors">
                                        <Video size={20} />
                                    </button>
                                    <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/20">
                                {messages.map((msg) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] md:max-w-[60%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                                            <div className={`p-4 rounded-2xl shadow-lg ${msg.sender === 'me'
                                                    ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-tr-none'
                                                    : 'bg-[#222] border border-white/10 text-gray-200 rounded-tl-none'
                                                }`}>
                                                {msg.image && (
                                                    <img src={msg.image} alt="Shared" className="rounded-lg mb-3 w-full object-cover" />
                                                )}
                                                <p className="leading-relaxed">{msg.text}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 px-2">{msg.time}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
                                <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-2xl p-2">
                                    <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-pink-400 transition-colors">
                                        <Image size={20} />
                                    </button>
                                    <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-pink-400 transition-colors">
                                        <MapPin size={20} />
                                    </button>
                                    <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-green-400 transition-colors">
                                        <DollarSign size={20} />
                                    </button>

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none px-2"
                                    />

                                    <button
                                        onClick={sendMessage}
                                        className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-pink-600/20"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <MessageCircle size={48} className="text-pink-500/50" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Tus Mensajes</h3>
                            <p>Selecciona una conversación para comenzar a chatear</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
