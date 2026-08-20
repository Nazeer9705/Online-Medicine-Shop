import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, AlertTriangle } from 'lucide-react';

interface MediAssistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediAssistDrawer: React.FC<MediAssistDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am MediAssist 🤖, your automated pharmacy assistant. How can I help you find medicines, check orders, or understand dosage basics today?' }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let botResponse = 'Thank you for your question! For specific medicines, please use our catalog search bar or consult a certified healthcare professional.';
      const lower = userText.toLowerCase();

      if (lower.includes('fever') || lower.includes('headache') || lower.includes('paracetamol')) {
        botResponse = 'For fever or mild pain relief, Paracetamol 500mg is commonly used. Always verify dosage with a physician and do not exceed 4g/day.';
      } else if (lower.includes('order') || lower.includes('track')) {
        botResponse = 'You can track your active orders by navigating to your Account Dashboard -> Orders section.';
      } else if (lower.includes('prescription')) {
        botResponse = 'Prescription required (Rx) items need a valid doctor prescription. Upload your document in the Prescriptions section for pharmacist review.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="bg-teal-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-700 p-2 rounded-xl text-yellow-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1">MediAssist AI Helper <Sparkles className="w-3.5 h-3.5 text-yellow-300" /></h3>
              <p className="text-[10px] text-teal-200">Educational Pharmacy Guidance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[10px] text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span><strong>Educational Use Only:</strong> MediAssist provides general guidance and cannot diagnose conditions or replace a doctor's advice.</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'bg-teal-700 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Ask about medicines, dosage or orders..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
          <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white p-2 rounded-xl">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
