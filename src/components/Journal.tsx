import React, { useState, useEffect } from 'react';
import { File, Image, X } from 'lucide-react';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  date: string;
  mediaCount: number;
}

const Journal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const saveEntry = () => {
    if (!title.trim() && !content.trim()) {
      alert('Please enter a title or content for your journal entry');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now(),
      title: title.trim() || 'Untitled Entry',
      content: content.trim(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      mediaCount: selectedFiles.length
    };

    setEntries(prev => [newEntry, ...prev]);
    setTitle('');
    setContent('');
    setSelectedFiles([]);
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-3xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">Daily Journal</h2>
      
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Your Thoughts
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day, thoughts, feelings..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[150px] resize-y"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Attach Media
          </label>
          <div className="relative">
            <input
              type="file"
              id="media-upload"
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <label
              htmlFor="media-upload"
              className="inline-flex items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <File className="mr-2 text-indigo-500" size={18} />
              <span>Choose images or videos</span>
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Image size={24} className="mx-auto text-gray-500" />
                      <span className="text-xs mt-1 block text-gray-500 truncate max-w-[90px]">
                        {file.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={saveEntry}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
        >
          Save Entry
        </button>
      </div>
      
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Previous Entries</h3>
        
        {entries.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No journal entries yet. Start writing to see your entries here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div 
                key={entry.id} 
                className="p-5 bg-white rounded-xl border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-gray-500 text-sm mb-1">{entry.date}</div>
                <h4 className="text-lg font-medium mb-2">{entry.title}</h4>
                <p className="text-gray-700 mb-3">{entry.content}</p>
                {entry.mediaCount > 0 && (
                  <div className="text-indigo-500 text-sm flex items-center">
                    <Image size={16} className="mr-1" />
                    <span>{entry.mediaCount} media file{entry.mediaCount !== 1 ? 's' : ''} attached</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;