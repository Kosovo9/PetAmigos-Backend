import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, IconButton, Paper, Grid, Avatar } from '@mui/material';
import { Send, Videocam, VideocamOff, Mic, MicOff, CallEnd } from '@mui/icons-material';

interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: Date;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'user', text: 'Hey there! Is this pet still available?', timestamp: new Date() },
        { id: '2', sender: 'me', text: 'Yes, it is!', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    const startCall = async () => {
        setIsCallActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Error accessing media devices", err);
        }
    };

    const endCall = () => {
        setIsCallActive(false);
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }
    };

    return (
        <Box sx={{ height: '80vh', p: 4, pt: "80px", display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Chat & Video 10X</Typography>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Paper sx={{ flexGrow: 1, mb: 2, p: 2, overflowY: 'auto' }}>
                        {messages.map((msg) => (
                            <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start', mb: 1 }}>
                                <Paper sx={{ p: 1, bgcolor: msg.sender === 'me' ? 'primary.main' : 'grey.200', color: msg.sender === 'me' ? 'white' : 'black' }}>
                                    <Typography variant="body1">{msg.text}</Typography>
                                </Paper>
                            </Box>
                        ))}
                    </Paper>
                    <Box sx={{ display: 'flex' }}>
                        <TextField fullWidth value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Type message..." />
                        <IconButton color="primary" onClick={() => { setMessages([...messages, { id: Date.now().toString(), sender: 'me', text: inputText, timestamp: new Date() }]); setInputText(''); }}>
                            <Send />
                        </IconButton>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'black' }}>
                        {isCallActive ? (
                            <video ref={localVideoRef} autoPlay muted style={{ width: '100%', maxHeight: '400px' }} />
                        ) : (
                            <Typography color="white">Video Call Inactive</Typography>
                        )}
                        <Box sx={{ mt: 2 }}>
                            {!isCallActive ? (
                                <Button variant="contained" startIcon={<Videocam />} onClick={startCall}>Start Video Call</Button>
                            ) : (
                                <IconButton color="error" onClick={endCall}><CallEnd /></IconButton>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChatInterface;
