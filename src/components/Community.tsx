import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageCircle, LogIn, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';

interface ChatRoom {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  members: number;
}

interface Message {
  id: number;
  text: string;
  sender: string;
  isCurrentUser: boolean;
  timestamp: string;
  room: string;
}

const socket = io(window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`);

const Community: React.FC = () => {
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<{[key: string]: number}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatRooms: ChatRoom[] = [
    {
      id: 'general',
      name: 'General Chat',
      icon: <MessageCircle size={24} />,
      description: 'Open discussion for everyone',
      members: onlineUsers.general || 0
    },
    {
      id: 'anxiety',
      name: 'Anxiety Support',
      icon: <Users size={24} />,
      description: 'Share experiences and coping strategies',
      members: onlineUsers.anxiety || 0
    },
    {
      id: 'depression',
      name: 'Depression Support',
      icon: <Users size={24} />,
      description: 'Find understanding and encouragement',
      members: onlineUsers.depression || 0
    },
    {
      id: 'random',
      name: 'Random Chat',
      icon: <MessageCircle size={24} />,
      description: 'Talk to someone new',
      members: onlineUsers.random || 0
    }
  ];

  useEffect(() => {
    const savedUsername = localStorage.getItem('mindcare-username');
    if (savedUsername) {
      setUsername(savedUsername);
      socket.emit('user_connected', { username: savedUsername });
    }

    socket.on('message_received', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user_count_update', (counts: {[key: string]: number}) => {
      setOnlineUsers(counts);
    });

    return () => {
      socket.off('message_received');
      socket.off('user_count_update');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinChatRoom = (roomId: string) => {
    if (!username) {
      setShowNameInput(true);
      return;
    }
    
    if (activeChatRoom) {
      socket.emit('leave_room', { room: activeChatRoom });
    }
    
    setActiveChatRoom(roomId);
    socket.emit('join_room', { room: roomId, username });
    setMessages([]);
  };

  const leaveChatRoom = () => {
    if (activeChatRoom) {
      socket.emit('leave_room', { room: activeChatRoom });
    }
    setActiveChatRoom(null);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' || !activeChatRoom) return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: username,
      isCurrentUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: activeChatRoom
    };
    
    socket.emit('send_message', newMessage);
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      localStorage.setItem('mindcare-username', username);
      socket.emit('user_connected', { username });
      setShowNameInput(false);
      
      if (activeChatRoom) {
        joinChatRoom(activeChatRoom);
      }
    }
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-3xl p-4 md:p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Community Support</h2>
      
      {showNameInput ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choose a Display Name</h3>
          <p className="text-gray-600 mb-4">
            This name will be visible to others in the community chat.
          </p>
          <div className="flex">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
            />
            <button
              onClick={handleSetUsername}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 flex items-center"
            >
              <LogIn size={18} className="mr-2" />
              Join
            </button>
          </div>
        </div>
      ) : activeChatRoom ? (
        <div className="flex flex-col h-[calc(100vh-350px)] min-h-[400px]">
          <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-2">
                {chatRooms.find(r => r.id === activeChatRoom)?.icon}
              </div>
              <span className="font-medium">
                {chatRooms.find(r => r.id === activeChatRoom)?.name}
              </span>
              <span className="ml-2 text-sm opacity-75">
                ({onlineUsers[activeChatRoom] || 0} online)
              </span>
            </div>
            <button
              onClick={leaveChatRoom}
              className="text-white hover:bg-indigo-700 p-1.5 rounded-full"
            >
              <LogOut size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 max-w-[80%] ${message.isCurrentUser ? 'ml-auto' : ''}`}
              >
                <div className={`px-4 py-2 rounded-xl ${
                  message.sender === 'System' 
                    ? 'bg-gray-200 text-gray-800 text-center max-w-none mx-auto' 
                    : message.isCurrentUser 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  {message.sender !== 'System' && (
                    <div className={`font-medium text-sm mb-1 ${
                      message.isCurrentUser ? 'text-indigo-100' : 'text-indigo-600'
                    }`}>
                      {message.sender}
                    </div>
                  )}
                  <div>{message.text}</div>
                </div>
                <div className={`text-xs mt-1 text-gray-500 ${
                  message.isCurrentUser ? 'text-right' : ''
                }`}>
                  {message.timestamp}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-xl flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-8">
            Connect with others who understand what you're going through. 
            All chats are anonymous and supportive.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chatRooms.map(room => (
              <div
                key={room.id}
                onClick={() => joinChatRoom(room.id)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow transform hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center mb-3">
                  <div className="mr-3 bg-white bg-opacity-20 p-2 rounded-full">
                    {room.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                </div>
                <p className="mb-3 text-white text-opacity-90">{room.description}</p>
                <div className="text-sm text-white text-opacity-80 flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{room.members} people online</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Community;