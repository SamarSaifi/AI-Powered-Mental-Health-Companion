import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Info } from 'lucide-react';

const BreathingExercise: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [showInfo, setShowInfo] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startBreathing = () => {
    if (isBreathing) return;
    
    setIsBreathing(true);
    setPhase('inhale');
    setCount(4);
    
    timerRef.current = window.setInterval(() => {
      setCount((prevCount) => {
        if (prevCount === 0) {
          setPhase((prevPhase) => {
            if (prevPhase === 'inhale') {
              return 'hold';
            } else if (prevPhase === 'hold') {
              return 'exhale';
            } else {
              return 'inhale';
            }
          });
          
          return prevPhase === 'inhale' ? 7 : prevPhase === 'hold' ? 8 : 4;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const stopBreathing = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsBreathing(false);
  };

  const getCircleClassName = () => {
    let className = "w-64 h-64 rounded-full border-4 flex items-center justify-center transition-all duration-4000 ease-in-out";
    
    if (phase === 'inhale') {
      className += " transform scale-125 bg-indigo-100 border-indigo-500";
    } else if (phase === 'hold') {
      className += " bg-indigo-200 border-indigo-600";
    } else {
      className += " transform scale-75 bg-indigo-50 border-indigo-400";
    }
    
    return className;
  };

  const getInstructionText = () => {
    if (!isBreathing) return "Click Start";
    return `${phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'} (${count})`;
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-3xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Breathing Exercise</h2>
      
      <div className="text-center">
        <div className="flex justify-center items-center mb-10">
          <p className="text-gray-700 mb-2 max-w-lg">
            Follow the expanding and contracting circle to regulate your breathing. 
            This exercise uses the 4-7-8 technique to reduce stress and anxiety.
          </p>
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className="ml-2 text-indigo-500 hover:text-indigo-700"
          >
            <Info size={18} />
          </button>
        </div>

        {showInfo && (
          <div className="bg-indigo-50 p-4 rounded-xl mb-8 text-left max-w-xl mx-auto">
            <h3 className="font-semibold text-indigo-700 mb-2">How It Works:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>Inhale</strong> through your nose for 4 seconds</li>
              <li><strong>Hold</strong> your breath for 7 seconds</li>
              <li><strong>Exhale</strong> completely through your mouth for 8 seconds</li>
              <li>Repeat the cycle 4-8 times</li>
            </ol>
            <p className="mt-4 text-gray-600 text-sm">
              This pattern helps activate your parasympathetic nervous system, which controls relaxation.
            </p>
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <div className={getCircleClassName()}>
            <span className="text-2xl font-medium text-indigo-800">
              {getInstructionText()}
            </span>
          </div>
          
          <div className="mt-10 flex space-x-4">
            <button
              onClick={startBreathing}
              disabled={isBreathing}
              className={`px-6 py-3 rounded-xl font-medium flex items-center ${
                isBreathing 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              <Play size={18} className="mr-2" />
              Start Exercise
            </button>
            
            <button
              onClick={stopBreathing}
              disabled={!isBreathing}
              className={`px-6 py-3 rounded-xl font-medium flex items-center ${
                !isBreathing 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <Square size={18} className="mr-2" />
              Stop
            </button>
          </div>
        </div>
        
        <div className="mt-12 max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4 text-left">Benefits of Deep Breathing:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            {[
              "Reduces stress and anxiety",
              "Lowers blood pressure",
              "Improves focus and concentration",
              "Promotes better sleep",
              "Reduces pain perception",
              "Boosts immune system",
              "Increases energy levels",
              "Improves digestion"
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;