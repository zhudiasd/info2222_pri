import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query } from '@/db/db';

export async function POST(request: Request) {
  try {
    const { username, newPassword } = await request.json();
    
    // Check if user exists
    const userResult = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    await query(
      'UPDATE users SET password_hash = $1 WHERE username = $2',
      [hashedPassword, username]
    );
    
    return NextResponse.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 