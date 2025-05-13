import { NextResponse } from 'next/server';
import { query } from '@/db/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { progress } = await request.json();
    
    if (progress === undefined || progress === null) {
      return NextResponse.json(
        { message: 'Progress value is required' },
        { status: 400 }
      );
    }

    // First check if the task exists
    const taskCheck = await query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );

    if (taskCheck.rows.length === 0) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Update the task's progress and status
    const result = await query(
      `UPDATE tasks 
       SET progress = $1, 
           status = CASE WHEN $1 = 100 THEN 'Completed' ELSE 'In Progress' END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [progress, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Failed to update task progress' },
        { status: 500 }
      );
    }
    
    // Get user info to include with the response
    const taskWithUser = await query(
      `SELECT t.*, u.full_name as "assignedTo"
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $1`,
      [id]
    );

    // Format the response to include assignedTo
    const task = taskWithUser.rows[0];
    return NextResponse.json({
      ...task,
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null,
      collaborators: task.collaborators || [],
      verified: task.verified || 0
    });
  } catch (error) {
    console.error('Error updating task progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 