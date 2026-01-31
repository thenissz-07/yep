
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, ArrowLeft, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getConversationFeedback } from '../services/geminiService';

interface ChatPracticeProps {
  onBack: () => void;
}

export const ChatPractice: React.FC<ChatPracticeProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hi there! I'm your English coding partner. Let's practice B1-level English. Can you explain a simple Python script or HTML layout you've worked on recently?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: "You are a helpful English coach. Speak at a B1 level (Intermediate). Use simple but structured sentences. Correct the user's grammar gently if they make A2-level mistakes. Keep the context technical (Python, HTML, Web Dev)."
        }
      });
      
      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I lost my connection. Could you repeat that?" }]);
    } finally {
      setLoading(false);
    }
  };

  const generateFeedback = async () => {
    setLoading(true);
    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const f = await getConversationFeedback(history);
    setFeedback(f);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col p-4 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Exit
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold text-slate-300">Live Practice Mode</span>
        </div>
        <button 
          onClick={generateFeedback}
          disabled={loading || messages.length < 3}
          className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all flex items-center disabled:opacity-50"
        >
          <Sparkles size={14} className="mr-1.5" />
          Get Feedback
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-slate-700'
              }`}>
                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none flex space-x-2 items-center">
              <Loader2 className="animate-spin text-indigo-500" size={16} />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        {feedback && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <h5 className="font-bold text-emerald-400 mb-2 flex items-center">
              <Sparkles size={18} className="mr-2" />
              Coach's Evaluation
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            <button 
              onClick={() => setFeedback(null)}
              className="mt-4 text-xs text-slate-500 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your explanation here..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          Tip: Use full sentences. Try using transition words like 'However', 'Furthermore', or 'For instance'.
        </p>
      </div>
    </div>
  );
};
