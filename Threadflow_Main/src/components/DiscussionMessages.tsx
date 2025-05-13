'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './ui/popup';
import { useAuth } from '@/contexts/AuthContext';

interface DiscussionMessagesProps {
  discussionId: number;
  discussionTitle: string;
  onBack: () => void;
  onMessageSent?: () => void;
}

interface Message {
  id: number | string;
  author: string;
  content: string;
  timestamp: string;
  serverId?: number;
  isPending?: boolean;
  failed?: boolean;
}

interface SubDiscussion {
  id: number;
  title: string;
  createdAt: string;
  lastMessageAt: string;
  messages: Message[];
  progress?: number;
}

export default function DiscussionMessages({ discussionId, discussionTitle, onBack, onMessageSent }: DiscussionMessagesProps) {
  console.log('[DEBUG] DiscussionMessages component initialized with discussionId:', discussionId);
  const { user } = useAuth();
  console.log('[DEBUG] User from AuthContext in DiscussionMessages:', user);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [subDiscussions, setSubDiscussions] = useState<SubDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Helper function to format dates
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  // Track locally added messages that haven't been confirmed from the server yet
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  
  // Use a ref to store the polling interval ID
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch messages and sub-discussions from the server
  useEffect(() => {
    console.log('[DEBUG] DiscussionMessages useEffect running for discussionId:', discussionId);
    let isMounted = true; // Track if component is mounted
    
    // Function to fetch data without setting up polling
    const fetchData = async (showLoading = true) => {
      console.log('[DEBUG] DiscussionMessages fetchData function called');
      if (!isMounted) return; // Don't proceed if component is unmounted
      
      if (pendingMessages.length > 0 || !showLoading) {
        // Don't show loading indicator when we have pending messages
        // or when explicitly requested not to
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      
      try {
        console.log('[DEBUG] Fetching messages and subdiscussions from API');
        // Fetch messages for the current discussion
        const messagesResponse = await fetch(`/api/messages?discussionId=${discussionId}`);
        console.log('[DEBUG] Messages API response status:', messagesResponse.status);
        
        const subDiscussionsResponse = await fetch(`/api/subdiscussions?discussionId=${discussionId}`);
        console.log('[DEBUG] Subdiscussions API response status:', subDiscussionsResponse.status);
        
        if (!isMounted) return; // Don't proceed if component is unmounted
        
        if (!messagesResponse.ok || !subDiscussionsResponse.ok) {
          console.error('[DEBUG] API response not OK - Messages:', messagesResponse.status, messagesResponse.statusText);
          console.error('[DEBUG] API response not OK - Subdiscussions:', subDiscussionsResponse.status, subDiscussionsResponse.statusText);
          throw new Error('Failed to fetch data');
        }
        
        const messagesData = await messagesResponse.json();
        const subDiscussionsData = await subDiscussionsResponse.json();
        
        if (!isMounted) return; // Don't proceed if component is unmounted
        
        console.log('[DEBUG] Raw messages data:', messagesData);
        
        // Separate messages into main discussion messages and sub-discussion messages
        const mainDiscussionMessages: Message[] = [];
        const subDiscussionMessagesMap = new Map<number, Message[]>();
        
        // Process all messages
        messagesData.forEach((m: any) => {
          const formattedMessage = {
            id: m.id,
            author: m.author,
            content: m.content,
            timestamp: formatDate(new Date(m.created_at)),
            serverId: m.id // Store the server ID for reference
          };
          
          if (m.subdiscussion_id) {
            // This is a sub-discussion message
            const subId = m.subdiscussion_id;
            if (!subDiscussionMessagesMap.has(subId)) {
              subDiscussionMessagesMap.set(subId, []);
            }
            subDiscussionMessagesMap.get(subId)?.push(formattedMessage);
            console.log(`[DEBUG] Added message to sub-discussion ${subId}:`, formattedMessage);
          } else {
            // This is a main discussion message
            mainDiscussionMessages.push(formattedMessage);
          }
        });
        
        // Transform sub-discussions data and associate messages
        const formattedSubDiscussions = subDiscussionsData.map((s: any) => {
          const subMessages = subDiscussionMessagesMap.get(s.id) || [];
          console.log(`[DEBUG] Sub-discussion ${s.id} has ${subMessages.length} messages`);
          
          // Calculate the last message timestamp
          let lastMessageTime = s.created_at;
          if (subMessages.length > 0) {
            // Find the most recent message timestamp by looking at all messages
            // This is a fallback in case the messages aren't already sorted
            lastMessageTime = subMessages.reduce((latest, msg) => {
              // Check if this message timestamp is more recent
              const msgTime = new Date(msg.timestamp).getTime();
              return msgTime > latest ? msgTime : latest;
            }, new Date(s.created_at).getTime());
          }
          
          return {
            id: s.id,
            title: s.title,
            createdAt: formatDate(new Date(s.created_at)),
            lastMessageAt: formatDate(new Date(lastMessageTime)),
            messages: subMessages,
            progress: s.progress || 0
          };
        });
        
        // Set main discussion messages
        const formattedMessages = mainDiscussionMessages;
        
        // If we have a selected sub-discussion, update its messages
        if (selectedSubDiscussion) {
          const updatedSubDiscussion = formattedSubDiscussions.find((sd: SubDiscussion) => sd.id === selectedSubDiscussion.id);
          if (updatedSubDiscussion) {
            console.log(`[DEBUG] Updating selected sub-discussion ${selectedSubDiscussion.id} with ${updatedSubDiscussion.messages.length} messages`);
            // Update the selected sub-discussion with new messages from the server
            setSelectedSubDiscussion(updatedSubDiscussion);
          }
        }
        
        // Check if any pending messages have been confirmed by the server
        const confirmedMessageIds = formattedMessages.map((m: Message) => m.serverId);
        const stillPendingMessages = pendingMessages.filter(pm => {
          // Keep messages that don't have a server ID yet or whose ID isn't in the confirmed list
          return !pm.serverId || !confirmedMessageIds.includes(pm.serverId);
        });
        
        // Combine server messages with any pending messages that haven't been confirmed yet
        const combinedMessages = [...formattedMessages, ...stillPendingMessages];
        
        if (!isMounted) return; // Don't proceed if component is unmounted
        
        setMessages(combinedMessages);
        setPendingMessages(stillPendingMessages);
        setSubDiscussions(formattedSubDiscussions);
      } catch (error) {
        console.error('[DEBUG] Error fetching data:', error);
        // Only use fallback data if we have no messages yet and component is still mounted
        if (isMounted && messages.length === 0 && pendingMessages.length === 0) {
          setMessages([
            {
              id: 1,
              author: 'Abhishek Yadav',
              content: 'Hi everyone, I created this discussion to talk about the upcoming project.',
              timestamp: '2 days ago',
            },
            {
              id: 2,
              author: 'Daiwik Neema',
              content: 'Thanks for setting this up! I have a few ideas I\'d like to share.',
              timestamp: '1 day ago',
            },
            {
              id: 3,
              author: 'Yang Liu',
              content: 'I\'ve been working on some designs that might be relevant here.',
              timestamp: '10 hours ago',
            },
          ]);
          
          setSubDiscussions([
            {
              id: 1,
              title: "UI Implementation Plan",
              createdAt: "1 day ago",
              lastMessageAt: "1 day ago",
              messages: [],
              progress: 30
            }
          ]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Initial data fetch
    fetchData();
    
    // Set up polling to refresh data every 10 seconds, but only for new messages
    // not for re-rendering the entire component
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(() => {
      // Use the silent fetch option to avoid showing loading indicators during polling
      fetchData(false);
    }, 10000); // Increased to 10 seconds to reduce load
    
    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      console.log('[DEBUG] DiscussionMessages cleanup - interval cleared for discussionId:', discussionId);
    };
  }, [discussionId]); // Only re-run when discussionId changes
  
  const [selectedSubDiscussion, setSelectedSubDiscussion] = useState<SubDiscussion | null>(null);
  const [isNewSubDiscussionOpen, setIsNewSubDiscussionOpen] = useState(false);
  const [newSubDiscussionTitle, setNewSubDiscussionTitle] = useState("");
  const [newMessage, setNewMessage] = useState('');
  
  const handleNewSubDiscussion = () => {
    setIsNewSubDiscussionOpen(true);
  };

  const handleCreateSubDiscussion = async () => {
    if (newSubDiscussionTitle.trim()) {
      try {
        console.log('[DEBUG] Creating sub-discussion with discussionId:', discussionId);
        const response = await fetch('/api/subdiscussions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'default-token'}`,
          },
          body: JSON.stringify({
            discussionId: discussionId,
            title: newSubDiscussionTitle.trim()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create sub-discussion');
        }

        const newSubDiscussion = await response.json();
        
        // Add the new sub-discussion to the state
        setSubDiscussions(prev => [...prev, {
          id: newSubDiscussion.id,
          title: newSubDiscussion.title,
          createdAt: 'just now',
          lastMessageAt: 'just now',
          messages: [],
          progress: 0
        }]);
        
        setNewSubDiscussionTitle('');
        setIsNewSubDiscussionOpen(false);
      } catch (error) {
        console.error('Error creating sub-discussion:', error);
        
        // Fallback to client-side creation if API fails
        setSubDiscussions(prev => [...prev, {
          id: Date.now(), // Use timestamp as temporary ID
          title: newSubDiscussionTitle.trim(),
          createdAt: "just now",
          lastMessageAt: "just now",
          messages: [],
          progress: 0
        }]);
        
        setNewSubDiscussionTitle('');
        setIsNewSubDiscussionOpen(false);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Create a temporary ID for the pending message
      const tempId = `temp-${Date.now()}`;
      
      // Create a pending message to show immediately
      const pendingMessage = {
        id: tempId,
        author: user?.full_name || 'You',
        content: newMessage.trim(),
        timestamp: 'just now',
        isPending: true
      };
      
      console.log('[DEBUG] Creating pending message:', pendingMessage);
      console.log('[DEBUG] Selected sub-discussion:', selectedSubDiscussion ? selectedSubDiscussion.id : 'none');
      
      // Call onMessageSent callback to notify parent that a message was sent
      if (!selectedSubDiscussion && onMessageSent) {
        onMessageSent();
      }
      
      // Add the pending message to the UI immediately
      if (selectedSubDiscussion) {
        // Update the selected sub-discussion with the new message
        const updatedSubDiscussion = {
          ...selectedSubDiscussion,
          messages: [...selectedSubDiscussion.messages, pendingMessage],
          lastMessageAt: 'just now'
        };
        
        // Update the sub-discussion in the state
        setSubDiscussions(prev => prev.map(sub => 
          sub.id === selectedSubDiscussion.id ? updatedSubDiscussion : sub
        ));
        
        // Also update the selectedSubDiscussion state to show the message immediately
        setSelectedSubDiscussion(updatedSubDiscussion);
        console.log('[DEBUG] Added message to sub-discussion UI:', updatedSubDiscussion.messages.length);
      } else {
        // Add to both messages and pendingMessages for main discussion
        setMessages(prev => [...prev, pendingMessage]);
        setPendingMessages(prev => [...prev, pendingMessage]);
        console.log('[DEBUG] Added message to main discussion UI');
      }
      
      // Clear the input field immediately
      setNewMessage('');
      
      try {
        // Send the message to the server
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'default-token'}`,
          },
          body: JSON.stringify({
            discussion_id: discussionId,
            subdiscussion_id: selectedSubDiscussion?.id || null,
            content: pendingMessage.content,
            username: user?.full_name || 'Anonymous'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const newMessageData = await response.json();
        
        console.log('[DEBUG] Message saved to server with ID:', newMessageData.id);
        
        // Update the pending message with the server ID
        if (selectedSubDiscussion) {
          // Create updated messages array with the server ID
          const updatedMessages = selectedSubDiscussion.messages.map(msg => 
            msg.id.toString() === tempId
              ? {
                  ...msg,
                  id: newMessageData.id,
                  serverId: newMessageData.id,
                  isPending: false
                }
              : msg
          );
          
          // Create updated sub-discussion object
          const updatedSubDiscussion = {
            ...selectedSubDiscussion,
            messages: updatedMessages,
            lastMessageAt: 'just now'
          };
          
          // Update the sub-discussion in the state
          setSubDiscussions(prev => prev.map(sub => 
            sub.id === selectedSubDiscussion.id ? updatedSubDiscussion : sub
          ));
          
          // Also update the selectedSubDiscussion state to show the confirmed message
          setSelectedSubDiscussion(updatedSubDiscussion);
          console.log('[DEBUG] Updated sub-discussion messages with server ID:', updatedMessages.length);
        } else {
          // Update main discussion messages
          setMessages(prev => prev.map(msg => 
            msg.id.toString() === tempId
              ? {
                  ...msg,
                  id: newMessageData.id,
                  serverId: newMessageData.id,
                  isPending: false
                }
              : msg
          ));
          
          // Update the pending message in the pendingMessages array
          setPendingMessages(prev => prev.map(msg => 
            msg.id.toString() === tempId
              ? {
                  ...msg,
                  id: newMessageData.id,
                  serverId: newMessageData.id,
                  isPending: false
                }
              : msg
          ));
          console.log('[DEBUG] Updated main discussion messages with server ID');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // The message is already in the UI, so we don't need to add it again
        // Just mark it as failed so the user knows it didn't send
        if (selectedSubDiscussion) {
          setSubDiscussions(prev => prev.map(sub => 
            sub.id === selectedSubDiscussion.id
              ? {
                  ...sub,
                  messages: sub.messages.map(msg => 
                    msg.id.toString() === tempId
                      ? { ...msg, failed: true }
                      : msg
                  )
                }
              : sub
          ));
        } else {
          setMessages(prev => prev.map(msg => 
            msg.id.toString() === tempId
              ? { ...msg, failed: true }
              : msg
          ));
        }
      }
    }
  };

  return (
    <div className="p-6">
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading messages...</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={selectedSubDiscussion ? () => setSelectedSubDiscussion(null) : onBack}
            variant="outline"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedSubDiscussion ? selectedSubDiscussion.title : discussionTitle}
            </h2>
            {selectedSubDiscussion && selectedSubDiscussion.progress !== undefined && (
              <p className="text-sm text-gray-600">
                Progress: {selectedSubDiscussion.progress}%
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!selectedSubDiscussion && (
            <Button
              onClick={handleNewSubDiscussion}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              + New Sub-discussion
            </Button>
          )}
        </div>
      </div>

      {!selectedSubDiscussion && subDiscussions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Sub-discussions</h3>
          <div className="space-y-2">
            {subDiscussions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubDiscussion(sub)}
                className="p-3 border rounded-md hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <h4 className="font-medium text-gray-900">{sub.title}</h4>
                <p className="text-sm text-gray-500">
                  {sub.messages.length} messages • Last message {sub.lastMessageAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6 max-h-[600px] overflow-y-auto">
        {(selectedSubDiscussion ? selectedSubDiscussion.messages : messages).map((message) => (
          <div 
            key={message.id}
            className={`flex ${
              message.author === user?.full_name ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-md md:max-w-lg rounded-lg p-3 ${
                message.author === user?.full_name
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {message.author !== user?.full_name && (
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {message.author}
                </div>
              )}
              <div className="text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.author === user?.full_name ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
                {message.isPending && ' • Sending...'}
                {message.failed && ' • Failed to send'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>

      <Dialog open={isNewSubDiscussionOpen} onOpenChange={setIsNewSubDiscussionOpen}>
        <DialogHeader>
          <DialogTitle>Create New Sub-discussion</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-discussion Title
              </label>
              <Input
                value={newSubDiscussionTitle}
                onChange={(e) => setNewSubDiscussionTitle(e.target.value)}
                placeholder="Enter sub-discussion title..."
                className="w-full"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button 
            variant="secondary" 
            onClick={() => setIsNewSubDiscussionOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSubDiscussion}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!newSubDiscussionTitle.trim()}
          >
            Create Sub-discussion
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
} 