import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/popup";
import DiscussionMessages from '../components/DiscussionMessages';
import { useAuth } from '../contexts/AuthContext';

interface Discussion {
  id: number;
  title: string;
  startedBy: string;
  messages: number;
  createdAt: string;
  lastMessageAt: string;
}

export default function DiscussionsPage() {
  console.log('[DEBUG] DiscussionsPage component initialized');
  const { user } = useAuth();
  console.log('[DEBUG] User from AuthContext:', user);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  
  // Fetch discussions from the server
  useEffect(() => {
    console.log('[DEBUG] DiscussionsPage useEffect running');
    const fetchDiscussions = async () => {
      console.log('[DEBUG] fetchDiscussions function called');
      try {
        console.log('[DEBUG] Fetching discussions from API');
        const response = await fetch('/api/discussions');
        console.log('[DEBUG] API response status:', response.status);
        if (!response.ok) {
          console.error('[DEBUG] API response not OK:', response.status, response.statusText);
          throw new Error('Failed to fetch discussions');
        }
        
        const data = await response.json();
        console.log('[DEBUG] API response data:', data);
        
        // Transform the data to match our interface
        console.log('[DEBUG] Transforming discussion data');
        const formattedDiscussions = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          startedBy: d.started_by,
          messages: d.message_count || 0,
          createdAt: formatDate(new Date(d.created_at)),
          lastMessageAt: formatDate(new Date(d.last_message_at || d.created_at))
        }));
        
        console.log('[DEBUG] Setting discussions state with formatted data:', formattedDiscussions);
        setDiscussions(formattedDiscussions);
      } catch (error) {
        console.error('[DEBUG] Error fetching discussions:', error);
        // Fallback to mock data if API fails
        setDiscussions([
          {
            id: 1,
            title: "Project Planning Discussion",
            startedBy: "Abhishek",
            messages: 6,
            createdAt: "2 days ago",
            lastMessageAt: "1 hour ago"
          },
          {
            id: 2,
            title: "Design Review",
            startedBy: "Yang",
            messages: 4,
            createdAt: "1 day ago",
            lastMessageAt: "3 hours ago"
          },
          {
            id: 3,
            title: "API Documentation",
            startedBy: "Daiwik",
            messages: 3,
            createdAt: "5 hours ago",
            lastMessageAt: "just now"
          }
        ]);
      }
    };
    
    fetchDiscussions();
  }, []);
  
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
  
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");

  // Function to update the lastMessageAt property of a discussion
  const updateDiscussionLastMessageTime = (discussionId: number) => {
    setDiscussions(prev => prev.map(discussion => 
      discussion.id === discussionId 
        ? { ...discussion, lastMessageAt: 'just now' }
        : discussion
    ));
  };

  const handleNewDiscussion = () => {
    setIsNewDiscussionOpen(true);
  };

  const handleCreateDiscussion = async () => {
    if (newDiscussionTitle.trim()) {
      try {
        const response = await fetch('/api/discussions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'default-token'}`,
          },
          body: JSON.stringify({
            title: newDiscussionTitle.trim(),
            username: user?.full_name || 'Anonymous'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create discussion');
        }

        const newDiscussion = await response.json();
        
        // Add the new discussion to the state
        setDiscussions(prev => [...prev, {
          id: newDiscussion.id,
          title: newDiscussion.title,
          startedBy: newDiscussion.started_by,
          messages: 0,
          createdAt: 'just now',
          lastMessageAt: 'just now'
        }]);
        
        setNewDiscussionTitle("");
        setIsNewDiscussionOpen(false);
      } catch (error) {
        console.error('Error creating discussion:', error);
        // Fallback to client-side creation if API fails
        setDiscussions(prev => [...prev, {
          id: prev.length + 1,
          title: newDiscussionTitle.trim(),
          startedBy: "You",
          messages: 0,
          createdAt: "just now",
          lastMessageAt: "just now"
        }]);
        setNewDiscussionTitle("");
        setIsNewDiscussionOpen(false);
      }
    }
  };

  const handleDiscussionClick = (discussionId: number) => {
    const discussion = discussions.find(d => d.id === discussionId);
    if (discussion) {
      setSelectedDiscussion(discussion);
    }
  };

  if (selectedDiscussion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
          <DiscussionMessages
            discussionId={selectedDiscussion.id}
            discussionTitle={selectedDiscussion.title}
            onBack={() => {
              // No need to update here as we're handling it in real-time with onMessageSent
              setSelectedDiscussion(null);
            }}
            onMessageSent={() => updateDiscussionLastMessageTime(selectedDiscussion.id)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b pb-4 p-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2 text-gray-900">Discussions</h1>
            <p className="text-gray-600">Collaborate with your team on various topics</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleNewDiscussion}
          >
            + New Discussion
          </Button>
        </div>

        <div className="space-y-4 p-6">
          {discussions.map((discussion) => (
            <Card 
              key={discussion.id} 
              className="border border-gray-200 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all duration-200"
              onClick={() => handleDiscussionClick(discussion.id)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1 hover:text-blue-600">
                      {discussion.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="text-gray-500">Started by {discussion.startedBy}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500">{discussion.messages} messages</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500"> {discussion.lastMessageAt}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {discussions.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg mx-6 mb-6">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No discussions yet</h3>
            <p className="mt-1 text-sm text-gray-600">Get started by creating a new discussion.</p>
            <div className="mt-6">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleNewDiscussion}
              >
                + New Discussion
              </Button>
            </div>
          </div>
        )}

        <Dialog open={isNewDiscussionOpen} onOpenChange={setIsNewDiscussionOpen}>
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Discussion Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter discussion title..."
                value={newDiscussionTitle}
                onChange={(e) => setNewDiscussionTitle(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDiscussionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDiscussion}>
              Create Discussion
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
} 