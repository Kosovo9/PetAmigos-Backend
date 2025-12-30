'use client';

import React, { useState } from 'react';
import { Send, Image, Mic, Video, Phone, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInterface() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hola! Vi tu perfil de Max 🐕', sender: 'them', time: '10:00 AM' },
        { id: 2, text: '¡Hola! Sí, sigue disponible para adopción.', sender: 'me', time: '10:02 AM' },
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInput('');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        LS
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Laura Smith</h3>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-600 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 text-gray-500">
                    <button className="p-2 hover:bg-gray-50 rounded-full"><Phone size={20} /></button>
                    <button className="p-2 hover:bg-gray-50 rounded-full"><Video size={20} /></button>
                    <button className="p-2 hover:bg-gray-50 rounded-full"><MoreVertical size={20} /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] p-3 rounded-2xl ${msg.sender === 'me'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                            }`}>
                            <p>{msg.text}</p>
                            <span className={`text-[10px] mt-1 block text-right ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>
                                {msg.time}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200">
                    <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <Image size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-gray-700"
                    />
                    <button className="p-2 text-gray-500 hover:text-blue-600">
                        <Mic size={20} />
                    </button>
                    <button
                        onClick={sendMessage}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-transform hover:scale-105"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
