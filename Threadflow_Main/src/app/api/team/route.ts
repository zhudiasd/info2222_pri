import { NextResponse } from 'next/server';
import { query } from '@/db/db';

export async function GET(request: Request) {
  try {
    const result = await query(
      `SELECT 
        id, 
        username as name, 
        role,
        full_name
      FROM users`
    );
    
    // Transform the data to match the expected format
    const teamMembers = result.rows.map(user => ({
      id: user.id,
      name: user.full_name,
      role: user.role,
      avatar: '', // We don't have avatars in the database, so we leave it empty
      status: 'Online' as const // Default status
    }));

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 