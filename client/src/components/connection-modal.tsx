import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface ConnectionModalProps {
  isOpen: boolean;
  onCancel: () => void;
  status: 'connecting' | 'reconnecting' | 'error';
  title?: string;
  message?: string;
}

export default function ConnectionModal({ 
  isOpen, 
  onCancel, 
  status,
  title,
  message 
}: ConnectionModalProps) {
  if (!isOpen) return null;

  const getTitle = () => {
    if (title) return title;
    switch (status) {
      case 'connecting': return 'Connecting...';
      case 'reconnecting': return 'Reconnecting...';
      case 'error': return 'Connection Error';
      default: return 'Connecting...';
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (status) {
      case 'connecting': return 'Looking for someone to chat with';
      case 'reconnecting': return 'Trying to reconnect to the chat';
      case 'error': return 'Unable to establish connection';
      default: return 'Please wait...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-800 rounded-xl p-6 max-w-sm w-full mx-4 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
            <Users className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{getTitle()}</h3>
            <p className="text-gray-400 text-sm">{getMessage()}</p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <Button 
            onClick={onCancel}
            variant="destructive"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
