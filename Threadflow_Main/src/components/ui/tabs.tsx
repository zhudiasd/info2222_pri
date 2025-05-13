'use client';

import * as React from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '');
  
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Clone children to pass activeTab
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        activeTab,
        onTabChange: handleTabChange
      });
    }
    return child;
  });

  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export function TabsList({ className, children, activeTab, onTabChange }: TabsListProps) {
  // Clone children to pass activeTab
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        activeTab,
        onTabChange 
      });
    }
    return child;
  });

  return (
    <div className={`flex border-b ${className}`}>
      {childrenWithProps}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export function TabsTrigger({ value, className, children, activeTab, onTabChange }: TabsTriggerProps) {
  const isActive = activeTab === value;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 focus:outline-none ${
        isActive 
          ? 'border-indigo-600 text-indigo-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className}`}
      onClick={() => onTabChange && onTabChange(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  activeTab?: string;
}

export function TabsContent({ value, className, children, activeTab }: TabsContentProps) {
  if (activeTab !== value) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}

