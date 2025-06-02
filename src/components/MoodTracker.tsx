import React, { useState } from 'react';
import AIAssistant from './AIAssistant';

interface Mood {
  id: string;
  emoji: string;
  name: string;
  gradient: string;
}

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const moods: Mood[] = [
    { 
      id: 'happy', 
      emoji: '😊', 
      name: 'Happy', 
      gradient: 'from-blue-400 to-cyan-400'
    },
    { 
      id: 'sad', 
      emoji: '😢', 
      name: 'Sad', 
      gradient: 'from-teal-200 to-pink-200'
    },
    { 
      id: 'anxious', 
      emoji: '😰', 
      name: 'Anxious', 
      gradient: 'from-red-200 to-pink-200'
    },
    { 
      id: 'calm', 
      emoji: '😌', 
      name: 'Calm', 
      gradient: 'from-green-200 to-lime-200'
    },
    { 
      id: 'angry', 
      emoji: '😠', 
      name: 'Angry', 
      gradient: 'from-red-400 to-orange-400'
    },
    { 
      id: 'excited', 
      emoji: '🤩', 
      name: 'Excited', 
      gradient: 'from-yellow-200 to-orange-200'
    },
  ];

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-3xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">How are you feeling today?</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`bg-gradient-to-r ${mood.gradient} p-6 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}
            onClick={() => handleMoodSelect(mood)}
          >
            <span className="block text-4xl mb-2">{mood.emoji}</span>
            <span className="text-lg font-medium">{mood.name}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <AIAssistant 
          mood={selectedMood} 
          onClose={() => setSelectedMood(null)} 
        />
      )}
    </div>
  );
};

export default MoodTracker;