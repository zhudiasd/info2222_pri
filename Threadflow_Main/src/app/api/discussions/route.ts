import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/db';

// GET: Fetch all discussions
export async function GET() {
  try {
    const result = await query(`
      SELECT d.*, 
             COUNT(m.id) as message_count,
             MAX(m.created_at) as last_message_at
      FROM discussions d
      LEFT JOIN messages m ON d.id = m.discussion_id
      GROUP BY d.id
      ORDER BY d.created_at DESC
    `);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

// POST: Create a new discussion
export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    let token;
    
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log('Received token:', token ? 'valid token' : 'empty token');
      }
    } else {
      console.log('No authorization header provided, continuing anyway for development');
    }
    
    // In a production app, you would verify the token properly
    
    const { title, username } = await req.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Discussion title is required' }, { status: 400 });
    }
    
    const result = await query(
      `INSERT INTO discussions (title, started_by) 
       VALUES ($1, $2) 
       RETURNING *`,
      [title, username || 'Anonymous']
    );
    
    console.log('Discussion created successfully:', result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}
