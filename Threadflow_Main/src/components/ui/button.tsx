'use client';

import * as React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { useAuth } from "@/contexts/AuthContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
}

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
}

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onStartProgress?: () => void;
  className?: string;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'default',
  children,
  ...props
}: ButtonProps) {
  let variantClasses = '';
  
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-700';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-100 text-gray-900 hover:bg-gray-200';
      break;
    case 'destructive':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700';
      break;
    case 'outline':
      variantClasses = 'border border-gray-300 bg-transparent hover:bg-gray-100';
      break;
    case 'link':
      variantClasses = 'bg-transparent text-indigo-600 hover:underline';
      break;
  }
  
  let sizeClasses = '';
  
  switch (size) {
    case 'default':
      sizeClasses = 'h-10 px-4 py-2';
      break;
    case 'sm':
      sizeClasses = 'h-8 px-3 py-1 text-sm';
      break;
    case 'lg':
      sizeClasses = 'h-12 px-6 py-3 text-lg';
      break;
  }
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 
        disabled:opacity-50 disabled:pointer-events-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStartProgress,
  className = '',
}: TaskCardProps) {
  const { user } = useAuth();
  let statusColor = '';
  
  switch (task.status) {
    case 'Completed':
      statusColor = 'bg-green-100 text-green-800';
      break;
    case 'In Progress':
      statusColor = 'bg-blue-100 text-blue-800';
      break;
    case 'Pending':
      statusColor = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      statusColor = 'bg-gray-100 text-gray-800';
  }
  
  let difficultyColor = '';
  
  switch (task.Difficulty) {
    case 'Hard':
      difficultyColor = 'bg-red-100 text-red-800';
      break;
    case 'Moderate':
      difficultyColor = 'bg-orange-100 text-orange-800';
      break;
    case 'Easy':
      difficultyColor = 'bg-green-100 text-green-800';
      break;
    default:
      difficultyColor = 'bg-gray-100 text-gray-800';
  }
  
  // Check if task is assigned to current user (case-insensitive)
  const isAssignedToCurrentUser = user && 
    task.assignedTo.toLowerCase() === user.full_name.toLowerCase();
  
  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
        <div className="flex space-x-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-gray-500"
            >
              Edit
            </Button>
          )}
          {onDelete && (user?.role === "Reviewer" || task.assignedTo.toLowerCase() === user?.full_name?.toLowerCase()) && (
            <div>
              {task.progress === 100 ? (
                task.verified === 1 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
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
                  onClick={onDelete}
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
      </div>
      
      {task.description && (
        <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
          {task.status}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor}`}>
          {task.Difficulty}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
        <div>Assigned to: <span className="font-medium">{task.assignedTo}</span></div>
        <div>Due: <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span></div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Begin Task button */}
      {onStartProgress && task.status === "Pending" && (isAssignedToCurrentUser || user?.role === "Reviewer") && (
        <Button
          variant="primary"
          size="sm"
          onClick={onStartProgress}
          className="mt-4 w-full"
        >
          Begin Task
        </Button>
      )}
    </div>
  );
}
