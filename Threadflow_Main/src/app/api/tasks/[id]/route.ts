import { NextResponse } from 'next/server';
import { query } from '@/db/db';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Delete the task from the database
    await query(
      'DELETE FROM tasks WHERE id = $1',
      [id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 