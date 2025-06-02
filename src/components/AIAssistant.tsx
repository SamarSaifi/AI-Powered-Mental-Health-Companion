import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface Mood {
  id: string;
  emoji: string;
  name: string;
  gradient: string;
}

interface AIAssistantProps {
  mood: Mood;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ mood, onClose }) => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'ai'}[]>([]);
  const [inputText, setInputText] = useState('');

  const moodResponses = {
    happy: {
      message: "That's wonderful! I can feel your positive energy. Happiness is a beautiful emotion, and I'm genuinely excited to see you feeling this way.",
      explanation: "When we're happy, our brain releases endorphins, dopamine, and serotonin - the natural 'feel-good' chemicals. This is the perfect time to build positive habits.",
      exercises: [
        "Gratitude Reflection: Write down 5 things you're grateful for",
        "Share the Joy: Reach out to someone who makes you smile",
        "Creative Expression: Channel this energy into art or music",
        "Nature Connection: Take a mindful walk outside",
        "Memory Making: Capture this moment in a journal"
      ],
      questions: [
        "What specifically is making you feel happy today?",
        "How would you like to celebrate this feeling?",
        "Who would you love to share this happiness with?"
      ]
    },
    sad: {
      message: "I see you're carrying some sadness today, and I want you to know that's completely okay. Sadness is a natural emotion that shows you care deeply. I'm here with you.",
      explanation: "Sadness often comes when we've experienced loss or disappointment. It's your heart's way of processing these experiences.",
      exercises: [
        "Self-Compassion Practice: Place a hand on your heart and breathe",
        "Gentle Journaling: Write down your thoughts without judgment",
        "Comfort Activity: Do something soothing like a warm bath",
        "Reach Out: Connect with someone who makes you feel safe",
        "Light Movement: Try some gentle stretching or walking"
      ],
      questions: [
        "Would you like to talk about what's making you feel sad?",
        "What usually helps you feel better when you're down?",
        "Is there someone you'd like to connect with right now?"
      ]
    },
    anxious: {
      message: "I can sense the anxiety you're experiencing. You're safe right now, and we'll work together to help you feel more grounded and in control.",
      explanation: "Anxiety is your body's natural alarm system, but sometimes it goes off when there's no real danger. Your nervous system is trying to protect you.",
      exercises: [
        "4-7-8 Breathing: Inhale for 4, hold for 7, exhale for 8",
        "5-4-3-2-1 Grounding: Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste",
        "Progressive Muscle Relaxation: Tense and release each muscle group",
        "Cold Water Reset: Splash cold water on your face",
        "Worry Postponement: Schedule a specific 'worry time' later"
      ],
      questions: [
        "What thoughts are running through your mind right now?",
        "Where do you feel the anxiety most in your body?",
        "What would help you feel safer in this moment?"
      ]
    },
    calm: {
      message: "What a beautiful state of mind you're in! This sense of calm is precious and shows that you're in harmony with yourself right now.",
      explanation: "Calmness indicates that your nervous system is in a balanced state. This is when your body can focus on healing and your mind can think clearly.",
      exercises: [
        "Mindful Meditation: Sit quietly and focus on your breath",
        "Reflective Journaling: Write about what led to this calm feeling",
        "Intention Setting: Use this clear headspace to set positive intentions",
        "Mindful Tea/Coffee: Prepare and drink something warm while being fully present",
        "Gentle Reading: Read something inspiring or educational"
      ],
      questions: [
        "What helped you reach this peaceful state?",
        "How can you remember this feeling for times when you need it?",
        "What positive intentions would you like to set while feeling centered?"
      ]
    },
    angry: {
      message: "I can feel the intensity of your anger, and that's completely valid. Anger often shows up when something important to you has been threatened or when you've been hurt.",
      explanation: "Anger is often a secondary emotion that covers hurt, frustration, or feeling powerless. It's your body's way of mobilizing energy to protect what matters to you.",
      exercises: [
        "Physical Release: Do jumping jacks or punch a pillow",
        "Anger Letter: Write an uncensored letter expressing everything you feel (don't send it)",
        "Ice Cube Technique: Hold ice cubes to ground yourself",
        "Deep Breathing: Take slow, deliberate breaths to regulate your system",
        "Problem-Solving: Once calmer, identify what specific issue needs addressing"
      ],
      questions: [
        "What situation triggered this anger?",
        "What need of yours isn't being met right now?",
        "How would you like to address what's bothering you?"
      ]
    },
    excited: {
      message: "Your excitement is absolutely contagious! I can feel your energy bubbling over, and it's such a joy to witness.",
      explanation: "Excitement happens when we anticipate something wonderful or when we're highly engaged with life. It's a powerful motivational state.",
      exercises: [
        "Share the Excitement: Call someone you love and share what's got you excited",
        "Channel Into Action: Use this energy to work on a project you care about",
        "Creative Expression: Let this energy flow into art, writing, or music",
        "Movement: Dance or exercise to express this physical energy",
        "Capture the Moment: Journal about this feeling to remember it later"
      ],
      questions: [
        "What's got you feeling so excited?",
        "How would you like to channel this amazing energy?",
        "What are you looking forward to most right now?"
      ]
    }
  };

  const currentMoodResponse = moodResponses[mood.id as keyof typeof moodResponses] || moodResponses.happy;

  const toggleChat = () => {
    if (!showChat) {
      setMessages([{
        text: `Hello! I notice you're feeling ${mood.name.toLowerCase()} today. How can I support you?`,
        sender: 'ai'
      }]);
    }
    setShowChat(!showChat);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputText, sender: 'user' }]);
    
    // Generate AI response based on mood and message content
    setTimeout(() => {
      const aiResponse = generateResponse(inputText, mood.id);
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    }, 1000);
    
    setInputText('');
  };

  const generateResponse = (message: string, moodType: string) => {
    // Simple response generator based on mood and message content
    // In a real app, this would be connected to a more sophisticated AI system
    const lowercaseMsg = message.toLowerCase();
    
    // Check for specific keywords
    if (lowercaseMsg.includes('help') || lowercaseMsg.includes('need help')) {
      return "I'm here to help. Would you like to try one of the exercises I suggested, or would you prefer to just talk?";
    }
    
    if (lowercaseMsg.includes('thank') || lowercaseMsg.includes('thanks')) {
      return "You're very welcome. I'm glad I could be here for you today.";
    }
    
    // Mood-specific responses
    const responses = {
      happy: [
        "Your positivity is wonderful to see! What else is bringing you joy today?",
        "I'm so glad you're feeling good! Is there something specific that triggered this happiness?",
        "Happiness looks good on you! How can you extend this feeling throughout your day?"
      ],
      sad: [
        "I understand that sadness can be heavy. What would comfort you most right now?",
        "It's okay to feel sad. Would you like to talk more about what's on your mind?",
        "I'm here with you through this difficult feeling. What small thing might bring you a moment of peace?"
      ],
      anxious: [
        "Let's take a deep breath together. In through the nose, out through the mouth. How did that feel?",
        "Anxiety can be overwhelming. What's one small thing we could focus on right now?",
        "You're safe here. Could you tell me more about what's making you feel anxious?"
      ],
      calm: [
        "This peaceful state is so valuable. What practices help you maintain this calmness?",
        "I appreciate the tranquility you're experiencing. How does it feel in your body?",
        "Calm moments are perfect for reflection. Is there anything you've been wanting to explore in your thoughts?"
      ],
      angry: [
        "Your anger is valid. What boundaries might need to be established or reinforced?",
        "I can sense your frustration. What would feeling heard look like for you right now?",
        "Anger often points to something important. What values of yours might have been violated?"
      ],
      excited: [
        "Your enthusiasm is contagious! Tell me more about what has you so energized!",
        "I love seeing this excitement! How are you planning to channel this positive energy?",
        "What a wonderful feeling! Is there someone special you'd like to share this excitement with?"
      ]
    };
    
    // Select a random response based on mood
    const moodResponses = responses[moodType as keyof typeof responses] || responses.happy;
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">AI Assistant - {mood.emoji} {mood.name} Mood</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="bg-white bg-opacity-80 rounded-xl p-5 mb-5">
        <p className="mb-4 text-lg">{currentMoodResponse.message}</p>
        
        <div className="bg-indigo-50 p-4 rounded-lg mb-4">
          <h4 className="text-indigo-700 font-medium mb-2">Understanding Your Mood:</h4>
          <p className="text-gray-700">{currentMoodResponse.explanation}</p>
        </div>
        
        <h4 className="text-indigo-700 font-medium my-3">Suggested Exercises:</h4>
        <ul className="space-y-2">
          {currentMoodResponse.exercises.map((exercise, index) => (
            <li key={index} className="bg-white p-3 rounded-lg border-l-4 border-indigo-500">
              {exercise}
            </li>
          ))}
        </ul>
        
        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl">
          <h4 className="font-medium mb-2">Let's Talk About It:</h4>
          <ul className="space-y-1 text-white text-opacity-90">
            {currentMoodResponse.questions.map((question, index) => (
              <li key={index}>• {question}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={toggleChat}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
      >
        {showChat ? 'Hide Chat' : 'Start Chat'}
      </button>

      {showChat && (
        <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h4 className="font-medium">Chat with AI Assistant</h4>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-500 text-white ml-auto' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="flex border-t border-gray-200 p-3 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;