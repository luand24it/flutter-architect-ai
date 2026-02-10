import React, { useState, KeyboardEvent } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-end gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-2 shadow-2xl focus-within:ring-2 focus-within:ring-flutter-light/50 focus-within:border-flutter-light transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your Flutter UI (e.g., 'A modern login screen with glassmorphism effect')..."
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-base p-3 min-h-[60px] max-h-[200px] resize-none focus:outline-none scrollbar-hide font-sans"
          disabled={isLoading}
        />
        <div className="pb-1 pr-1">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 ${
              !input.trim() || isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-flutter-blue hover:bg-flutter-light text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
      <div className="absolute -top-10 left-0 flex items-center gap-2 text-slate-400 text-sm">
        <Sparkles size={14} className="text-yellow-400" />
        <span>Try: "Dashboard for a smart home app using GridView"</span>
      </div>
    </div>
  );
};
