import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useSocket } from "@/hooks/use-socket";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  roomId: string | null;
  isConnected: boolean;
}

export default function ChatPanel({ onSendMessage, roomId, isConnected }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { socket } = useSocket();

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat-message') {
          const message: Message = {
            id: data.message.id,
            content: data.message.content,
            senderId: data.message.senderId,
            timestamp: new Date(data.message.timestamp),
            isOwn: false // Will be determined by comparing senderId
          };
          
          setMessages(prev => [...prev, message]);
        }
      } catch (error) {
        console.error('Error parsing chat message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear messages when room changes
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
    }
  }, [roomId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    // Add message to local state immediately for better UX
    const localMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: 'local',
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, localMessage]);
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicator (placeholder for future implementation)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      // Send typing stopped event
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-dark-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-dark-600 flex items-center justify-between">
        <h3 className="font-semibold">Chat</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-400">{isConnected ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start a conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg ${
              message.isOwn 
                ? 'bg-indigo-600 text-white' 
                : 'bg-dark-700 text-white'
            }`}>
              <p className="text-sm">{message.content}</p>
              <span className={`text-xs block mt-1 ${
                message.isOwn ? 'opacity-75' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-dark-700 text-gray-400 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-dark-600">
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder={isConnected ? "Type a message..." : "Connect to start chatting"}
            className="flex-1 bg-dark-700 border-dark-600 text-white placeholder-gray-400 focus:border-indigo-500"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-indigo-600 hover:bg-indigo-700 p-2"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
