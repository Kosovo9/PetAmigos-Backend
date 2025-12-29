
// Mock hooks for Messenger
export const useAdvancedMessenger = (id: string) => ({
    messages: [],
    sendMessage: (msg: string) => console.log('Sending message:', msg),
    sendVoiceMessage: (blob: Blob) => console.log('Sending voice:', blob),
    sendFile: (file: any) => console.log('Sending file:', file),
    setTyping: (typing: boolean) => console.log('Typing:', typing),
    participants: [{ name: 'John Doe' }],
    onlineStatus: { isOnline: true, lastSeen: 'now' },
});

// Mock Components
export const VoiceRecorder = (props: any) => <button>🎤</button>;
export const FileUploader = (props: any) => <div>{ props.children } </div>;
export const EmojiPicker = (props: any) => <div>😀</div>;
export const MessageReactions = (props: any) => <div>👍</div>;
export const TypingIndicator = (props: any) => <div>Typing...</div>;
