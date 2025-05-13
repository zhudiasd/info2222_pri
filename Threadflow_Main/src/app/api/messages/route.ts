import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/db';

// GET: Fetch all messages
export async function GET(req: NextRequest) {
  try {
    // Optional: Get discussion ID from query params to filter messages
    const url = new URL(req.url);
    const discussionId = url.searchParams.get('discussionId');
    
    let queryText = 'SELECT * FROM messages';
    let params: any[] = [];
    
    if (discussionId) {
      queryText += ' WHERE discussion_id = $1';
      params.push(discussionId);
    }
    
    queryText += ' ORDER BY created_at ASC';
    
    const result = await query(queryText, params);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Create a new message
export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    
    // For development purposes, we'll accept requests without auth
    // or with a default token
    if (authHeader) {
      if (!authHeader.startsWith('Bearer ')) {
        console.warn('Invalid authorization header format');
      } else {
        const token = authHeader.split(' ')[1];
        console.log('Received token:', token ? 'valid token' : 'empty token');
      }
    } else {
      console.log('No authorization header provided, continuing anyway for development');
    }
    
    // In a production app, you would verify the token properly
    
    const { discussion_id, subdiscussion_id, content, username } = await req.json();
    
    if (!discussion_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Use the username from the request or a default value
    const author = username || 'Anonymous';
    
    const result = await query(
      `INSERT INTO messages (discussion_id, subdiscussion_id, author, content, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [discussion_id, subdiscussion_id || null, author, content]
    );
    
    console.log('Message saved successfully:', result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
