
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { useAdvancedMessenger } from '../hooks/useAdvancedMessenger';
import { VoiceRecorder, FileUploader, EmojiPicker, MessageReactions, TypingIndicator } from '../component/MessengerComponents';

export const AdvancedMessenger: React.FC<{ conversationId: string }> = ({ conversationId }) => {
    const {
        messages,
        sendMessage,
        sendVoiceMessage,
        sendFile,
        setTyping,
        participants,
        onlineStatus,
    } = useAdvancedMessenger(conversationId);

    const [inputMessage, setInputMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Typing indicator
    useEffect(() => {
        if (inputMessage.trim()) {
            setTyping(true);
        } else {
            setTyping(false);
        }
    }, [inputMessage]);

    const handleSend = () => {
        if (inputMessage.trim()) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    };

    const handleVoiceRecording = (audioBlob: Blob) => {
        sendVoiceMessage(audioBlob);
    };

    const handleFileUpload = (files: FileList) => {
        Array.from(files).forEach(file => {
            sendFile(file);
        });
    };

    const handleEmojiSelect = (emoji: string) => {
        setInputMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {participants[0]?.name[0]}
                    </div>
                    <div>
                        <h3 className="font-semibold">{participants[0]?.name}</h3>
                        <p className="text-sm text-gray-500">
                            {onlineStatus.isOnline ? 'En línea' : `Última vez ${onlineStatus.lastSeen}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message: any) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.isOwn
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                        : 'bg-white text-gray-800 shadow-lg'
                                    }`}
                            >
                                {message.type === 'text' && <p>{message.content}</p>}
                                {message.type === 'voice' && (
                                    <VoiceMessage audioUrl={message.audioUrl} duration={message.duration} />
                                )}
                                {message.type === 'file' && (
                                    <FileMessage file={message.file} />
                                )}

                                {/* Message Reactions */}
                                <MessageReactions
                                    messageId={message.id}
                                    reactions={message.reactions}
                                    isOwn={message.isOwn}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <TypingIndicator participants={participants} />
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-4">
                <div className="flex items-end gap-2">
                    {/* Left Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Smile className="w-5 h-5" />
                        </button>

                        <FileUploader onFileSelect={handleFileUpload}>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Paperclip className="w-5 h-5" />
                            </button>
                        </FileUploader>
                    </div>

                    {/* Input */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="w-full p-3 border rounded-lg resize-none max-h-32 min-h-[48px]"
                            rows={1}
                        />

                        {/* Emoji Picker */}
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <div className="absolute bottom-full left-0 mb-2">
                                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Voice Recorder */}
                    <VoiceRecorder
                        onRecording={handleVoiceRecording}
                        isRecording={isRecording}
                        setIsRecording={setIsRecording}
                    />

                    {/* Send Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        disabled={!inputMessage.trim()}
                        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

// Sub-componentes
const VoiceMessage: React.FC<{ audioUrl: string; duration: number }> = ({ audioUrl, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={togglePlay}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30"
            >
                {isPlaying ? '⏸️' : '▶️'}
            </button>
            <span className="text-sm">{duration}s</span>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
        </div>
    );
};

const FileMessage: React.FC<{ file: any }> = ({ file }) => {
    return (
        <a
            href={file.url}
            download={file.name}
            className="flex items-center gap-2 p-2 bg-white/20 rounded-lg hover:bg-white/30"
        >
            <span className="text-sm">📎 {file.name}</span>
            <span className="text-xs opacity-75">({(file.size / 1024).toFixed(1)} KB)</span>
        </a>
    );
};
