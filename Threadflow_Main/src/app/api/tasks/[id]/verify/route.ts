import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    // First check if the task exists and get its current state
    const checkResult = await query(
      `SELECT * FROM tasks WHERE id = $1`,
      [taskId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Task not found' },
        { status: 404 }
      );
    }

    // Update the task's verified status and set status to Completed
    const result = await query(
      `UPDATE tasks 
       SET verified = 1,
           status = 'Completed'
       WHERE id = $1
       RETURNING *`,
      [taskId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Failed to update task' },
        { status: 500 }
      );
    }

    // Return the updated task with all fields
    return NextResponse.json({
      ...result.rows[0],
      verified: 1,
      status: 'Completed'
    });
  } catch (error) {
    console.error('Error verifying task:', error);
    return NextResponse.json(
      { message: 'Failed to verify task' },
      { status: 500 }
    );
  }
} 