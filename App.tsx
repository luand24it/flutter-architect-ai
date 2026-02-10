import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Code2, Zap, Layout, Github, Menu, X } from 'lucide-react';
import { generateFlutterCode } from './services/geminiService';
import { CodeBlock } from './components/CodeBlock';
import { InputArea } from './components/InputArea';
import { ChatMessage, GeneratedResult } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call Gemini
      const result: GeneratedResult = await generateFlutterCode(text);

      // Add Assistant Message
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.explanation,
        parsed: result,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error generating the code. Please verify your API Key or try a different description.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-flutter-light/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 w-72 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-flutter-blue rounded-lg shadow-lg shadow-blue-900/50">
              <Smartphone size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">FlutterGen</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Features</h3>
            <div className="flex items-center gap-3 p-2 text-sm text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <Code2 size={16} className="text-flutter-light" />
              <span>Dart Generation</span>
            </div>
            <div className="flex items-center gap-3 p-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Layout size={16} className="text-purple-400" />
              <span>Material 3 Design</span>
            </div>
            <div className="flex items-center gap-3 p-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors">
              <Zap size={16} className="text-yellow-400" />
              <span>Mock Data</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-indigo-900/20 to-blue-900/20 rounded-xl border border-blue-900/30">
            <h4 className="font-semibold text-blue-200 mb-2 text-sm">Pro Tip</h4>
            <p className="text-xs text-blue-300/80 leading-relaxed">
              Be specific about colors and layout structure (e.g., "Use a Stack for the hero image and a floating action button").
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-sm text-slate-400 hover:text-white"
          >
            <Github size={18} />
            <span>Open Source</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="font-semibold text-white">Flutter Architect AI</h2>
              <span className="text-xs text-slate-500 hidden sm:inline-block">Powered by Gemini 3 Flash</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
               Online
             </span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className="w-20 h-20 bg-gradient-to-tr from-flutter-blue to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-6">
                <Smartphone size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">What shall we build today?</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                I can generate complete, production-ready Flutter code using Material 3. 
                Describe your UI, and I'll write the code for you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                 {[
                   "E-commerce Product Detail Page",
                   "Social Media Profile with GridView",
                   "Crypto Wallet Dashboard",
                   "Music Player with Glassmorphism"
                 ].map((suggestion, idx) => (
                   <button 
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 text-sm bg-slate-900 border border-slate-800 hover:border-flutter-light/50 hover:bg-slate-800 rounded-xl text-left text-slate-300 transition-all"
                   >
                     {suggestion}
                   </button>
                 ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col gap-3 animate-[slideUp_0.3s_ease-out] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className={`flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <span>{msg.role === 'user' ? 'You' : 'Flutter Architect'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>

                  {msg.role === 'user' ? (
                    <div className="bg-gradient-to-br from-flutter-blue to-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg max-w-[85%]">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      {msg.content && (
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                           <p>{msg.content}</p>
                        </div>
                      )}
                      {msg.parsed?.code && (
                        <CodeBlock code={msg.parsed.code} />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 animate-pulse">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                     <div className="w-2 h-2 bg-flutter-light rounded-full animate-bounce"></div>
                   </div>
                   <div className="text-slate-500 text-sm py-2">Generating Flutter code...</div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-4 md:p-6 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 z-40">
           <InputArea onSend={handleSend} isLoading={isLoading} />
        </div>
      </main>

      {/* Global styles for animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
