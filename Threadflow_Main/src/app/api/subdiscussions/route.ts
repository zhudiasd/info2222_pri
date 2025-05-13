import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/db/db';

// GET: Fetch subdiscussions for a specific discussion
export async function GET(req: NextRequest) {
  try {
    const discussionId = req.nextUrl.searchParams.get('discussionId');
    
    if (!discussionId) {
      return NextResponse.json({ error: 'Discussion ID is required' }, { status: 400 });
    }
    
    // Query to get subdiscussions with their last message timestamp
    const result = await query(`
      SELECT s.*, 
             MAX(m.created_at) as last_message_at 
      FROM subdiscussions s
      LEFT JOIN messages m ON s.id = m.subdiscussion_id
      WHERE s.discussion_id = $1
      GROUP BY s.id
      ORDER BY s.created_at DESC`,
      [discussionId]
    );
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching subdiscussions:', error);
    return NextResponse.json({ error: 'Failed to fetch subdiscussions' }, { status: 500 });
  }
}

// POST: Create a new subdiscussion
export async function POST(req: NextRequest) {
  try {
    const { discussionId, title } = await req.json();
    
    if (!discussionId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await query(
      `INSERT INTO subdiscussions (discussion_id, title, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING *`,
      [discussionId, title]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating subdiscussion:', error);
    return NextResponse.json({ error: 'Failed to create subdiscussion' }, { status: 500 });
  }
}

// PUT: Update a subdiscussion (e.g., to update progress)
export async function PUT(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For simplicity, we'll accept any token for now and skip role checking
    // In a production app, you would verify the token and check the user's role
    
    const { id, progress, role } = await req.json();
    
    // Only reviewers can update progress
    if (role !== 'Reviewer') {
      return NextResponse.json({ error: 'Permission denied: Only reviewers can update progress' }, { status: 403 });
    }
    
    if (!id || progress === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await query(
      `UPDATE subdiscussions 
       SET progress = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [progress, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Subdiscussion not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating subdiscussion:', error);
    return NextResponse.json({ error: 'Failed to update subdiscussion' }, { status: 500 });
  }
}
