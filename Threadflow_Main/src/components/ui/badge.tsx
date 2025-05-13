'use client';

import * as React from 'react';
import { cn } from "@/lib/utils";

interface BadgeProps {
  status: string;
  className?: string;
}

export function Badge({ status, className = '' }: BadgeProps) {
  let statusClasses = '';
  
  switch (status) {
    case 'Completed':
      statusClasses = 'bg-green-100 text-green-800';
      break;
    case 'In Progress':
      statusClasses = 'bg-blue-100 text-blue-800';
      break;
    case 'Pending':
      statusClasses = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      statusClasses = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses} ${className}`}
    >
      {status}
    </span>
  );
}