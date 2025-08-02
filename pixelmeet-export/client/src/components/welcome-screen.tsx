import { Button } from "@/components/ui/button";
import { Video, Mic, Play } from "lucide-react";

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export default function WelcomeScreen({ onStartChat }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-40">
      <div className="max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Video className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to PixelMeet</h1>
            <p className="text-gray-400">Connect with random people around the world through video chat</p>
          </div>

          {/* Permissions */}
          <div className="bg-dark-800 rounded-xl p-4 space-y-3">
            <p className="text-sm text-gray-300">We need access to:</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Video className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Camera for video chat</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mic className="w-4 h-4 text-indigo-500" />
                <span className="text-sm">Microphone for voice chat</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={onStartChat}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Chatting
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 leading-relaxed">
            By clicking "Start Chatting", you agree to our{' '}
            <a href="#" className="text-indigo-500 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-indigo-500 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
