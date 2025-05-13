'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from './ui/popup';

interface ProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProgress: number;
  onSave: (progress: number) => void;
}

export default function ProgressDialog({ 
  open, 
  onOpenChange, 
  initialProgress, 
  onSave 
}: ProgressDialogProps) {
  const [progressValue, setProgressValue] = useState(initialProgress);

  // Reset progress value when dialog is opened or initialProgress changes
  useEffect(() => {
    if (open) {
      setProgressValue(initialProgress);
    }
  }, [open, initialProgress]);

  const handleUpdateProgress = () => {
    onSave(progressValue);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Update Progress</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700 mb-3">
              Progress: {progressValue}%
            </label>
            <input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={progressValue}
              onChange={(e) => setProgressValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateProgress}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Update Progress
        </Button>
      </DialogFooter>
    </Dialog>
  );
} 