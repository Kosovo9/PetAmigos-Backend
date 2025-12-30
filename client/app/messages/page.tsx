import ChatInterface from '../../src/components/chat/ChatInterface';

export default function MessagesPage() {
    return (
        <div className="container mx-auto px-4 pt-24 pb-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Messages 10X</h1>
            <div className="max-w-4xl mx-auto">
                <ChatInterface />
            </div>
        </div>
    );
}
