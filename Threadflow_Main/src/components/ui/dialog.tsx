import * as React from "react"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-lg shadow-lg max-w-md w-full"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-b">
      {children}
    </div>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6">
      {children}
    </div>
  );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-t flex justify-end space-x-2">
      {children}
    </div>
  );
} 