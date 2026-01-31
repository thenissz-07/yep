
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, ArrowLeft, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getConversationFeedback } from '../services/geminiService.ts';

export const ChatPractice = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! I'm your English coding partner. Let's practice B1-level English. Can you explain a simple Python script or HTML layout you've worked on recently?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const scrollRef = useRef(null);

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
      // Initialize AI client right before making an API call using the process.env.API_KEY directly.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview', // Pro model for better technical tutoring and feedback.
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
    try {
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      const f = await getConversationFeedback(history);
      setFeedback(f);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col p-4 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Exit
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">B1 Speaking Lab</span>
        </div>
        <button 
          onClick={generateFeedback}
          disabled={loading || messages.length < 3}
          className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all flex items-center disabled:opacity-50"
        >
          <Sparkles size={14} className="mr-1.5" />
          Coach Feedback
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-slate-700'
              }`}>
                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10 shadow-lg' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none flex space-x-2 items-center">
              <Loader2 className="animate-spin text-indigo-500" size={16} />
              <span className="text-[10px] text-slate-500 font-mono">Processing...</span>
            </div>
          </div>
        )}
        {feedback && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <h5 className="font-bold text-emerald-400 mb-2 flex items-center text-xs uppercase tracking-widest">
              <Sparkles size={16} className="mr-2" />
              Progress Report
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            <button 
              onClick={() => setFeedback(null)}
              className="mt-4 text-[10px] uppercase font-black text-slate-500 hover:text-white"
            >
              Clear Analysis
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
            placeholder="Explain a concept or ask a question..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
