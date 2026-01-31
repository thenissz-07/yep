
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, ArrowLeft, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getConversationFeedback } from '../services/geminiService.js';

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
      // Initialize AI client right before making an API call.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: "You are a helpful English coach. Speak at a B1 level (Intermediate). Use simple but structured sentences. Correct the user's grammar gently if they make A2-level mistakes. Keep the context technical (Python, HTML, Web Dev)."
        }
      });
      
      const response = await chat.sendMessage({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (