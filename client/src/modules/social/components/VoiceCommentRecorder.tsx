import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Send, Trash2 } from 'lucide-react';

export const VoiceCommentRecorder: React.FC<{ postId: number, onSent?: () => void }> = ({ postId, onSent }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [uploading, setUploading] = useState(false);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Mic access denied:', err);
            alert('Microphone access is required to record voice comments.');
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const sendVoiceComment = async () => {
        if (!audioBlob) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'comment.webm');
        formData.append('userId', '1'); // TODO: Replace with real Auth ID
        formData.append('postId', postId.toString());

        try {
            const res = await fetch('/api/audio/comment', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setAudioBlob(null);
                if (onSent) onSent();
            } else {
                console.error("Upload failed");
                alert('Failed to send voice comment.');
            }
        } catch (e) {
            console.error(e);
            alert('Error uploading voice comment.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
            {!audioBlob ? (
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-full shadow-md transition-colors ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                    title={isRecording ? "Stop Recording" : "Record Voice Comment"}
                >
                    {isRecording ? <Square size={20} /> : <Mic size={20} />}
                </motion.button>
            ) : (
                <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-left-2">
                    <audio src={URL.createObjectURL(audioBlob)} controls className="h-10 w-48 rounded-md" />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={sendVoiceComment}
                        disabled={uploading}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md disabled:opacity-50"
                    >
                        {uploading ? <span className="animate-spin">⌛</span> : <Send size={18} />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAudioBlob(null)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                        <Trash2 size={18} />
                    </motion.button>
                </div>
            )}
            {isRecording && <span className="text-red-500 text-sm font-medium animate-pulse ml-2">Recording...</span>}
        </div>
    );
};
