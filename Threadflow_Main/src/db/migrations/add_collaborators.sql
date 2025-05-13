-- Add collaborators column to tasks table
ALTER TABLE tasks 
ADD COLUMN collaborators TEXT[] DEFAULT NULL;

-- Update existing tasks to have empty collaborators array
UPDATE tasks SET collaborators = '{}' WHERE collaborators IS NULL; 