// Mock hooks for Messenger
export const useAdvancedMessenger = (id: string) => ({
  messages: [],
  sendMessage: (msg: string) => console.log("Sending message:", msg),
  sendVoiceMessage: (blob: Blob) => console.log("Sending voice:", blob),
  sendFile: (file: any) => console.log("Sending file:", file),
  setTyping: (typing: boolean) => console.log("Typing:", typing),
  participants: [{ name: "John Doe" }],
  onlineStatus: { isOnline: true, lastSeen: "now" },
});

// Mock Components (non-JSX)
export const VoiceRecorder = (props: any) => ({ type: "VoiceRecorder", props });
export const FileUploader = (props: any) => ({ type: "FileUploader", props });
export const EmojiPicker = (props: any) => ({ type: "EmojiPicker", props });
export const MessageReactions = (props: any) => ({
  type: "MessageReactions",
  props,
});
export const TypingIndicator = (props: any) => ({
  type: "TypingIndicator",
  props,
});
