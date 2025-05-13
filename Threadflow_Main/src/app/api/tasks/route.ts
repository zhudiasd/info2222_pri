import { NextResponse } from 'next/server';
import { query } from '@/db/db';

export async function GET() {
  try {
    const result = await query(
      `SELECT t.*, u.full_name as "assignedTo"
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       ORDER BY t.created_at DESC`
    );

    // Ensure verified status is included in the response and format the date
    const tasks = result.rows.map(task => ({
      ...task,
      verified: task.verified || 0, // Ensure verified is always a number
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null,
      Difficulty: task.difficulty // Ensure difficulty is properly mapped
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// Add a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, assignedTo, status, Difficulty, dueDate, progress, collaborators } = body;
    
   
    const userResult = await query(
      'SELECT id FROM users WHERE full_name = $1',
      [assignedTo]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    const assignedToId = userResult.rows[0].id;
    
    const result = await query(
      `INSERT INTO tasks 
        (name, description, assigned_to, status, difficulty, due_date, progress, collaborators) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [name, description, assignedToId, status, Difficulty, dueDate, progress || 0, collaborators || null]
    );
    

    const task = result.rows[0];
    return NextResponse.json({ 
      ...task,
      assignedTo,
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null,
      collaborators: collaborators || []
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, assignedTo, status, Difficulty, dueDate, progress, collaborators } = body;
    
    const userResult = await query(
      'SELECT id FROM users WHERE full_name = $1',
      [assignedTo]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    const assignedToId = userResult.rows[0].id;
    
    const result = await query(
      `UPDATE tasks 
      SET 
        name = $1, 
        description = $2, 
        assigned_to = $3, 
        status = $4, 
        difficulty = $5, 
        due_date = $6, 
        progress = $7,
        collaborators = $8
      WHERE id = $9
      RETURNING *`,
      [name, description, assignedToId, status, Difficulty, dueDate, progress, collaborators || null, id]
    );
    

    const task = result.rows[0];
    return NextResponse.json({ 
      ...task,
      assignedTo,
      dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null,
      collaborators: collaborators || []
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 