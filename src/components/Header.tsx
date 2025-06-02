import React from 'react';
import { BrainCog } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'mood', name: 'Mood Tracker' },
    { id: 'journal', name: 'Journal' },
    { id: 'breathing', name: 'Breathing' },
    { id: 'community', name: 'Community' },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <BrainCog size={36} className="text-white mr-2" />
          <h1 className="text-4xl font-bold text-white">MindCare</h1>
        </div>
        <p className="text-white text-opacity-90">Your AI-Powered Mental Health Companion</p>
      </div>

      <div className="flex justify-center bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`px-4 py-2 rounded-xl mx-1 transition-all duration-300 ${
              activeSection === section.id
                ? 'bg-white bg-opacity-20 transform -translate-y-0.5 shadow-md'
                : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;