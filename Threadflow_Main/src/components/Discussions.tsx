import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SubThread {
  topic: string;
  messages: string[];
  subThreads: SubThread[];
}

const Discussions: React.FC = () => {
  const [threads, setThreads] = useState<SubThread[]>([
    { 
      topic: 'General Discussion', 
      messages: ['Welcome to the discussion!'],
      subThreads: []
    },
  ]);
  const [newMessages, setNewMessages] = useState<string[]>(['']);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newSubThreadTitle, setNewSubThreadTitle] = useState('');
  const [selectedThreadIndex, setSelectedThreadIndex] = useState<number | null>(null);

  const handleInputChange = (index: number, value: string) => {
    const updatedMessages = [...newMessages];
    updatedMessages[index] = value;
    setNewMessages(updatedMessages);
  };

  const addMessage = (threadIndex: number) => {
    if (newMessages[threadIndex]?.trim()) {
      const updatedThreads = [...threads];
      updatedThreads[threadIndex].messages.push(newMessages[threadIndex]);
      setThreads(updatedThreads);
      handleInputChange(threadIndex, '');
    }
  };

  const addNewThread = () => {
    if (newThreadTitle.trim()) {
      setThreads([...threads, {
        topic: newThreadTitle,
        messages: [],
        subThreads: []
      }]);
      setNewMessages([...newMessages, '']);
      setNewThreadTitle('');
    }
  };

  const addSubThread = (parentIndex: number) => {
    if (newSubThreadTitle.trim()) {
      const updatedThreads = [...threads];
      updatedThreads[parentIndex].subThreads.push({
        topic: newSubThreadTitle,
        messages: [],
        subThreads: []
      });
      setThreads(updatedThreads);
      setNewSubThreadTitle('');
    }
  };

  const renderThread = (thread: SubThread, index: number, level: number = 0) => (
    <div key={index} className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${level > 0 ? 'ml-6 mt-2' : 'mb-4'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`font-semibold ${level === 0 ? 'text-xl' : 'text-lg'} text-gray-900`}>{thread.topic}</h2>
        {level === 0 && (
          <Button 
            variant="secondary"
            onClick={() => setSelectedThreadIndex(selectedThreadIndex === index ? null : index)}
          >
            {selectedThreadIndex === index ? 'Cancel' : 'Add Subtopic'}
          </Button>
        )}
      </div>
      
      {selectedThreadIndex === index && level === 0 && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newSubThreadTitle}
            onChange={(e) => setNewSubThreadTitle(e.target.value)}
            placeholder="Enter subtopic title..."
            className="flex-1 p-2 border rounded-md"
          />
          <Button onClick={() => addSubThread(index)}>Add Subtopic</Button>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {thread.messages.map((msg, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-700">{msg}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Textarea
          className="flex-1 border border-gray-300 rounded-lg p-2"
          placeholder="Type a message..."
          value={newMessages[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
        <Button onClick={() => addMessage(index)}>Send</Button>
      </div>

      {thread.subThreads.map((subThread, subIndex) => (
        renderThread(subThread, subIndex, level + 1)
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          placeholder="Enter new discussion topic..."
          className="flex-1 p-2 border rounded-md"
        />
        <Button onClick={addNewThread}>New Discussion</Button>
      </div>

      <div className="space-y-4">
        {threads.map((thread, index) => renderThread(thread, index))}
      </div>
    </div>
  );
};

export default Discussions; 