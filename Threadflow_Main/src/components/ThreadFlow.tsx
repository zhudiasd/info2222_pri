import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs,TabsContent } from "@/components/ui/tabs";
import { TaskCard, Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/popup";
import DiscussionsPage from '@/pages/DiscussionsPage';
import ProgressDialog from './ProgressDialog';
import toast from 'react-hot-toast';

interface Task {
  id: number;
  name: string;
  description: string;
  assignedTo: string;
  status: "Pending" | "In Progress" | "Completed";
  Difficulty: "Hard" | "Moderate" | "Easy";
  dueDate: string;
  progress: number;
  verified?: number;
  collaborators?: string[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: "Online" | "Away" | "Offline";
}

interface NewTaskForm {
  name: string;
  description: string;
  assignedTo: string;
  Difficulty: "Hard" | "Moderate" | "Easy";
  dueDate: string;
}

export default function CommunicationSystem() {
  const { user, logout } = useAuth();
  
  // Initialize with default values - we'll load from the server
  const [activeTab, setActiveTab] = useState("threads");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskForm>({
    name: "",
    description: "",
    assignedTo: "",
    Difficulty: "Moderate",
    dueDate: new Date().toISOString().split('T')[0]
  });
  
  // Initialize with empty arrays - we'll load from the server
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // This state is used in handleOpenProgressDialog and handleUpdateProgress
  const [progressValue, setProgressValue] = useState(0); 
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout>();
  const [notifications, setNotifications] = useState<{taskId: number, message: string}[]>([]);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [taskToCollaborate, setTaskToCollaborate] = useState<Task | null>(null);

  // Define handleOpenProgressDialog function first, before it's used
  const handleOpenProgressDialog = (task: Task) => {
    if (!task || !user) {
      console.error("No task or user selected");
      return;
    }

    const isReviewer = user.role === "Reviewer";
    const isAssignedToCurrentUser = task.assignedTo && user.full_name && 
      task.assignedTo.toLowerCase() === user.full_name.toLowerCase();
    const isCollaborator = user.full_name && task.collaborators &&
      task.collaborators.some(c => c && c.toLowerCase() === user.full_name.toLowerCase());
    
    // Only proceed if user is a reviewer OR the task is assigned to them OR the user is a collaborator
    if (isReviewer || isAssignedToCurrentUser || isCollaborator) {
      setSelectedTask(task);
      // Set the progress value for the dialog - this is used in handleUpdateProgress
      setProgressValue(task.progress || 0);
      setIsProgressDialogOpen(true);
    } else {
      console.error("Permission denied: You cannot update this task's progress");
      toast.error("You don't have permission to update this task's progress");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, teamResponse] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/team')
        ]);

        if (!tasksResponse.ok || !teamResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const tasksData = await tasksResponse.json();
        const teamData = await teamResponse.json();

        // Update tasks state with the fetched data, preserving verified status
        setTasks(prevTasks => {
          const updatedTasks = tasksData.map((newTask: Task) => {
            const existingTask = prevTasks.find(t => t.id === newTask.id);
            return {
              ...newTask,
              verified: existingTask?.verified || newTask.verified || 0
            };
          });
          return updatedTasks;
        });

        setTeamMembers(teamData);
      } catch (error) {
        console.error('Error fetching from API:', error);
        toast.error('Failed to fetch data. Please try again.');
      }
    };

    // Fetch data immediately when the component mounts or when user changes
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchData, 10000);
    setPollingInterval(interval);

    // Clean up interval on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]); // Add user as a dependency to refetch when user changes

  // Separate useEffect for the event listener
  useEffect(() => {
    // Listen for the custom updateTaskProgress event
    const handleUpdateTaskProgress = (event: Event) => {
      const customEvent = event as CustomEvent;
      
      const task = tasks.find(t => t.id === customEvent.detail.taskId);
      
      if (task) {
        handleOpenProgressDialog(task);
      }
    };

    document.addEventListener('updateTaskProgress', handleUpdateTaskProgress);

    // Clean up the event listener
    return () => {
      document.removeEventListener('updateTaskProgress', handleUpdateTaskProgress);
    };
  }, [tasks]); // Only include tasks, not handleOpenProgressDialog

  const handleAddTask = async () => {
    if (newTask.name && newTask.assignedTo) {
      try {
        // Format the date to ensure it's valid
        const formattedDate = new Date(newTask.dueDate).toISOString().split('T')[0];
        
        // Create a new task via the API
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newTask.name,
            description: newTask.description,
            assignedTo: newTask.assignedTo,
            status: "Pending",
            Difficulty: newTask.Difficulty,
            dueDate: formattedDate,
            progress: 0
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }

        const createdTask = await response.json();
        
        // Add the new task to the state
        setTasks(prev => [...prev, createdTask]);
        
        // Reset the form
        setNewTask({
          name: "",
          description: "",
          assignedTo: "",
          Difficulty: "Moderate",
          dueDate: new Date().toISOString().split('T')[0]
        });
        setIsDialogOpen(false);

      } catch (error) {
        console.error('Error creating task:', error);
        toast.error('Failed to create task. Please try again.');
      }
    }
  };

  const handleEditTask = (task: Task) => {
    // Format the date when editing a task
    const formattedDate = new Date(task.dueDate).toISOString().split('T')[0];
    setNewTask({
      name: task.name,
      description: task.description,
      assignedTo: task.assignedTo,
      Difficulty: task.Difficulty,
      dueDate: formattedDate
    });
    setIsEditing(true);
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (newTask.name && newTask.assignedTo) {
      try {
        // Format the date before saving
        const formattedDate = new Date(newTask.dueDate).toISOString().split('T')[0];
        
        if (isEditing && selectedTask) {
          // Update existing task via the API
          const response = await fetch('/api/tasks', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: selectedTask.id,
              name: newTask.name,
              description: newTask.description,
              assignedTo: newTask.assignedTo,
              status: selectedTask.status,
              Difficulty: newTask.Difficulty,
              dueDate: formattedDate,
              progress: selectedTask.progress
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update task');
          }

          const updatedTask = await response.json();
          
          // Update the local state with the updated task from the server
          setTasks(prev => prev.map(task =>
            task.id === selectedTask.id ? updatedTask : task
          ));
        } else {
          // Add new task
          await handleAddTask();
          // handleAddTask already updates the state and resets the form
          return;
        }
        
        // Reset form and state
        setIsEditing(false);
        setSelectedTask(null);
        setIsDialogOpen(false);
        setNewTask({
          name: "",
          description: "",
          assignedTo: "",
          Difficulty: "Moderate",
          dueDate: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error('Error saving task:', error);
        toast.error('Failed to save task. Please try again.');
      }
    }
  };

  const handleUpdateProgress = async (newProgress: number, taskToUpdate = selectedTask) => {
    if (!taskToUpdate || !user) {
      console.error("No task or user selected for progress update");
      return;
    }

    // Strict permission check: Only reviewers OR task assignees OR collaborators can update
    const isReviewer = user.role === "Reviewer";
    const isAssignedToCurrentUser = taskToUpdate.assignedTo && user.full_name && 
      taskToUpdate.assignedTo.toLowerCase() === user.full_name.toLowerCase();
    const isCollaborator = user.full_name && taskToUpdate.collaborators &&
      taskToUpdate.collaborators.some(c => c && c.toLowerCase() === user.full_name.toLowerCase());
    
    const canUpdate = isReviewer || isAssignedToCurrentUser || isCollaborator;
    
    if (!canUpdate) {
      console.error("Permission denied: You cannot update this task's progress");
      toast.error("You don't have permission to update this task's progress");
      setIsProgressDialogOpen(false);
      return;
    }
    
    try {
      // Update task progress via the new API endpoint
      const response = await fetch(`/api/tasks/${taskToUpdate.id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: newProgress
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task progress');
      }

      const updatedTask = await response.json();
      
      // Update the local state with the updated task from the server
      setTasks(prev => prev.map(task =>
        task.id === taskToUpdate.id ? updatedTask : task
      ));
      
      toast.success('Progress updated successfully');
      setIsProgressDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update task progress');
    }
  };

  // Helper function to count tasks by difficulty for a team member
  const getTaskCountsByMember = (memberName: string) => {
    const memberTasks = tasks.filter(task => task.assignedTo === memberName);
    return {
      easy: memberTasks.filter(task => task.Difficulty === "Easy").length,
      Moderate: memberTasks.filter(task => task.Difficulty === "Moderate").length,
      hard: memberTasks.filter(task => task.Difficulty === "Hard").length,
      total: memberTasks.length
    };
  };

  // Check for approaching deadlines and find potential collaborators
  const checkDeadlinesAndNotify = useCallback(() => {
    if (!user) return;
    
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    

    const tasksWithApproachingDeadlines = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      const isApproaching = dueDate <= threeDaysFromNow && dueDate >= today;
      const isIncomplete = task.status !== "Completed" && task.progress < 80;
      return isApproaching && isIncomplete;
    });
    
    const workloadMetrics = teamMembers.map(member => {
      const memberTasks = tasks.filter(task => task.assignedTo === member.name);
      const pendingTasks = memberTasks.filter(task => task.status !== "Completed");
      

      const difficultyWeights = {
        "Easy": 1,
        "Moderate": 2,
        "Hard": 3
      };
      
      const pendingWorkload = pendingTasks.reduce((sum, task) => 
        sum + difficultyWeights[task.Difficulty], 0
      );
      
      const totalWorkload = memberTasks.reduce((sum, task) => 
        sum + difficultyWeights[task.Difficulty], 0
      );
      
      const laggingFactor = totalWorkload > 0 ? pendingWorkload / totalWorkload : 0;
      
      return {
        name: member.name,
        pendingWorkload,
        totalWorkload,
        laggingFactor
      };
    });
    
    const currentUserWorkload = workloadMetrics.find(m => m.name === user.full_name);
    
    if (currentUserWorkload) {
      const mostBehindMembers = workloadMetrics.filter(m => m.laggingFactor > 0.6);

      const totalPendingWorkload = workloadMetrics.reduce((sum, m) => sum + m.pendingWorkload, 0);
      const averagePendingWorkload = totalPendingWorkload / workloadMetrics.length;
      
      const canHelp = currentUserWorkload.pendingWorkload < averagePendingWorkload;
      
      if (canHelp && mostBehindMembers.length > 0) {
        const tasksFromLaggingMembers = tasksWithApproachingDeadlines.filter(task => 
          task.assignedTo && mostBehindMembers.some(m => m.name === task.assignedTo)
        );

        const eligibleTasks = tasksFromLaggingMembers.filter(task => 
          !task.collaborators?.includes(user.full_name)
        );
        

        const newNotifications = eligibleTasks.map(task => {
          const assigneeLaggingFactor = workloadMetrics.find(m => m.name === task.assignedTo)?.laggingFactor || 0;
          const laggingPercentage = Math.round(assigneeLaggingFactor * 100);
          
          return {
            taskId: task.id,
            message: `${task.assignedTo} is ${laggingPercentage}% behind on their workload and approaching a deadline for "${task.name}". Would you like to help?`
          };
        });
        

        if (newNotifications.length > 0) {
          setNotifications(prev => {
            const existingTaskIds = prev.map(n => n.taskId);
            const uniqueNewNotifications = newNotifications.filter(n => !existingTaskIds.includes(n.taskId));
            return [...prev, ...uniqueNewNotifications];
          });
        }
      }
    }
  }, [tasks, teamMembers, user]);

  // Helper function to join a task as collaborator
  const joinTaskAsCollaborator = async (task: Task) => {
    if (!user || !task) return;
    
    try {
      // Create updated task object with current user added as collaborator
      const updatedTask = {
        ...task,
        collaborators: task.collaborators ? [...task.collaborators, user.full_name] : [user.full_name]
      };
      
      // Update task via API
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to join task');
      }

      const result = await response.json();
      
      // Update the local state
      setTasks(prev => prev.map(t => t.id === task.id ? result : t));
      
      // Remove notification for this task
      setNotifications(prev => prev.filter(n => n.taskId !== task.id));
      
      toast.success(`You've joined ${task.assignedTo}'s task: ${task.name}`);
      setShowNotificationDialog(false);
      setTaskToCollaborate(null);
    } catch (error) {
      console.error('Error joining task:', error);
      toast.error('Failed to join the task. Please try again.');
    }
  };

  // Check for approaching deadlines when tasks or team members change
  useEffect(() => {
    checkDeadlinesAndNotify();
  }, [tasks, teamMembers, checkDeadlinesAndNotify]);

  // No need to save to localStorage as we're using the server API

  // Add a deleteTask function
  const handleDeleteTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      toast.error('Task not found');
      return;
    }

    if (task.progress === 100 && task.verified === 0) {
      toast.error('This task is completed but not yet verified. Please wait for reviewer verification before deleting.');
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  // Add handleVerifyTask function after handleUpdateProgress
  const handleVerifyTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/verify`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify task');
      }

      const updatedTask = await response.json();
      
      // Update the task in the local state with both verified status and completed status
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, verified: 1, status: 'Completed' } : task
      ));

      toast.success('Task verified successfully');
    } catch (error) {
      console.error('Error verifying task:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify task');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 py-6">
        <div className="flex justify-between items-center px-6 mb-8">
          <h1 className="text-2xl font-bold text-indigo-700">ThreadFlow</h1>
          <Button
            variant="secondary"
            onClick={() => {
              localStorage.removeItem('threadflow_activeTab');
              localStorage.removeItem('threadflow_tasks');
              localStorage.removeItem('threadflow_team');
              logout();
            }}
            className="text-sm"
          >
            Logout
          </Button>
        </div>
        <div className="mt-6">
          <div className="space-y-1">
            <div 
              className={`flex items-center space-x-3 w-full px-6 py-3 ${activeTab === "threads" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"} cursor-pointer transition-colors duration-200`} 
              onClick={() => setActiveTab("threads")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>Discussions</span>
            </div>

            <div 
              className={`flex items-center space-x-3 w-full px-6 py-3 ${activeTab === "tasks" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"} cursor-pointer transition-colors duration-200`} 
              onClick={() => setActiveTab("tasks")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span>Tasks</span>
            </div>

            <div 
              className={`flex items-center space-x-3 w-full px-6 py-3 ${activeTab === "progress" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"} cursor-pointer transition-colors duration-200`} 
              onClick={() => setActiveTab("progress")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Progress</span>
            </div>

            <div 
              className={`flex items-center space-x-3 w-full px-6 py-3 ${activeTab === "team" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"} cursor-pointer transition-colors duration-200`} 
              onClick={() => setActiveTab("team")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>Team</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-600 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {user?.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{user?.full_name}</h2>
                {notifications.length > 0 && (
                  <button 
                    className="flex items-center text-sm text-indigo-600 mt-1"
                    onClick={() => setShowNotificationDialog(true)}
                  >
                    <div className="relative mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    </div>
                    Collaboration Requests
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Team Role</p>
                <p className="text-sm font-Moderate text-gray-900">{user?.role}</p>
              </div>
              <Button variant="secondary" className="text-sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tasks Tab Content */}
            <TabsContent value="tasks" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
                <Button onClick={() => {
                  setIsEditing(false);
                  setSelectedTask(null);
                  setIsDialogOpen(true);
                }}>
                  Add Task
                </Button>
              </div>
              
              {/* Tasks List - Only show Pending tasks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks
                  .filter(task => task.status === "Pending")
                  .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onStartProgress={() => {
                      // Update the task status to "In Progress" with 0% progress
                      handleUpdateProgress(0, task);
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Progress Tab Content */}
            <TabsContent value="progress" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">In Progress & Completed</h2>
                <p className="text-gray-600">Track ongoing and completed tasks</p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {/* Filter tasks to show only In Progress or Completed tasks */}
                {tasks
                  .filter(task => task.status === "In Progress" || task.status === "Completed")
                  .map(task => (
                  <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.name}</h3>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="relative">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium border-2 border-white">
                                {task.assignedTo ? 
                                  task.assignedTo.split(" ").map(n => n[0]).join('') :
                                  '?'
                                }
                              </div>
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div className="ml-3">
                              <span className="block text-sm font-medium text-gray-900">Assigned to:</span>
                              <span className="block text-sm text-gray-600">{task.assignedTo || 'Unassigned'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <span className="block text-sm font-medium text-gray-900">Due:</span>
                              <span className="block text-sm text-gray-600">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="mr-2">
                              <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                task.Difficulty === "Easy" ? "bg-blue-100 text-blue-800" :
                                task.Difficulty === "Moderate" ? "bg-orange-100 text-orange-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {task.Difficulty}
                              </span>
                            </div>
                            <div>
                              <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                task.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add delete button */}
                      {(user?.role === "Reviewer" || (task?.assignedTo && user?.full_name && task.assignedTo.toLowerCase() === user?.full_name?.toLowerCase())) && (
                        <div className="ml-4">
                          {task.progress === 100 ? (
                            task.verified === 1 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-500"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                              </Button>
                            ) : (
                              <span className="text-sm text-yellow-600">
                                Cannot delete - Awaiting verification
                              </span>
                            )
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Collaborators section */}
                    {task.collaborators && task.collaborators.length > 0 && (
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Collaborators:</h4>
                        <div className="flex flex-wrap gap-2">
                          {task.collaborators.map((collaborator, index) => (
                            <div key={index} className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                              <span className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mr-1">
                                {collaborator.charAt(0)}
                              </span>
                              {collaborator}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Current Progress</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                          {task.progress === 100 && (
                            task.verified === 1 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                Verified
                              </span>
                            ) : user?.role === "Reviewer" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyTask(task.id)}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                Verify Completion
                              </Button>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Awaiting Verification
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            task.status === "Completed" ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      

                      
                      {/* Simplified condition: Show button if user is a reviewer OR task is assigned to them */}
                      {activeTab === "progress" && (
                        (user?.role === "Reviewer") || 
                        (task?.assignedTo && user?.full_name && 
                          task.assignedTo.toLowerCase() === user.full_name.toLowerCase()) || 
                        (user?.full_name && task?.collaborators && 
                          task.collaborators.some(c => c && c.toLowerCase() === user.full_name.toLowerCase()))
                      ) && (
                        <Button
                          onClick={() => handleOpenProgressDialog(task)}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          {task?.assignedTo && user?.full_name && 
                            task.assignedTo.toLowerCase() === user.full_name.toLowerCase()
                              ? "Update Your Progress" 
                              : "Update Progress"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {tasks.filter(task => task.status === "In Progress" || task.status === "Completed").length === 0 && (
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-180 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks in progress</h3>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Team Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        member.status === "Online" ? "bg-green-500" : 
                        member.status === "Away" ? "bg-yellow-500" : "bg-gray-400"
                      }`}></div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-2">Task Distribution</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-green-50 p-2 rounded">
                          <span className="block font-semibold text-green-700">
                            {getTaskCountsByMember(member.name).easy}
                          </span>
                          <span className="text-gray-600">Easy</span>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <span className="block font-semibold text-yellow-700">
                            {getTaskCountsByMember(member.name).Moderate}
                          </span>
                          <span className="text-gray-600">Med</span>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <span className="block font-semibold text-red-700">
                            {getTaskCountsByMember(member.name).hard}
                          </span>
                          <span className="text-gray-600">Hard</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Discussions Tab Content */}
            <TabsContent value="threads" className="space-y-4">
              {/* Add debugging logs */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussions</h2>
                <DiscussionsPage key="discussions-page" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Task Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                id="title"
                type="text"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter task title..."
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter task description..."
              />
            </div>
            
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select
                id="assignee"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select team member</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>{member.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={newTask.Difficulty}
                onChange={(e) => setNewTask({ ...newTask, Difficulty: e.target.value as any })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveTask}>
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Progress Update Dialog */}
      <ProgressDialog
        open={isProgressDialogOpen}
        onOpenChange={setIsProgressDialogOpen}
        initialProgress={selectedTask?.progress || 0}
        onSave={handleUpdateProgress}
      />

      {/* Notification Dialog */}
      <Dialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Collaboration Requests
          </DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-gray-500">No pending collaboration requests.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const task = tasks.find(t => t.id === notification.taskId);
                return (
                  <div key={notification.taskId} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 mb-2">{notification.message}</p>
                        {task && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              {task.assignedTo}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-end space-x-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setNotifications(prev => prev.filter(n => n.taskId !== notification.taskId));
                            }}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Ignore
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              if (task) {
                                joinTaskAsCollaborator(task);
                              }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                            Help Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}