import React, { useState } from 'react';
import { BrainCog } from 'lucide-react';
import Header from './components/Header';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import BreathingExercise from './components/BreathingExercise';
import Community from './components/Community';

function App() {
  const [activeSection, setActiveSection] = useState('mood');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <Header 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />

        {/* Mood Tracker Section */}
        {activeSection === 'mood' && <MoodTracker />}

        {/* Journal Section */}
        {activeSection === 'journal' && <Journal />}

        {/* Breathing Exercise Section */}
        {activeSection === 'breathing' && <BreathingExercise />}

        {/* Community Section */}
        {activeSection === 'community' && <Community />}
      </div>
    </div>
  );
}

export default App;