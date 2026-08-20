import React, { useState } from 'react';
import { Mic, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const startListening = () => {
    setListening(true);
    setTranscript('Listening... Speak medicine name now');

    // Simulate Speech Recognition
    setTimeout(() => {
      setTranscript('Paracetamol 500mg');
      setListening(false);
    }, 2500);
  };

  const handleSearch = () => {
    if (transcript && transcript !== 'Listening... Speak medicine name now') {
      onClose();
      navigate(`/medicines?search=${encodeURIComponent(transcript)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-slate-900 text-lg mb-1">Voice Medicine Search</h3>
        <p className="text-xs text-slate-500 mb-6">Say the medicine or brand name to search</p>

        <div className="flex justify-center mb-6">
          <button
            onClick={startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              listening ? 'bg-red-500 animate-pulse text-white shadow-lg shadow-red-200' : 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-200'
            }`}
          >
            <Mic className="w-8 h-8" />
          </button>
        </div>

        <p className="text-sm font-semibold text-slate-800 min-h-[40px] mb-4">
          {transcript || 'Click mic icon to start'}
        </p>

        {transcript && transcript !== 'Listening... Speak medicine name now' && (
          <button
            onClick={handleSearch}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" /> Search Medicine
          </button>
        )}
      </div>
    </div>
  );
};
