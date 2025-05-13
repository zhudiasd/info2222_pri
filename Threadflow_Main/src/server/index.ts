import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/db';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};


app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;


    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );


    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const result = await query(`
      SELECT t.*, u.full_name as assigned_to_name
      FROM tasks t
      JOIN users u ON t.assigned_to = u.id
      ORDER BY t.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tasks/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (req.user.role !== 'Reviewer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

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
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/tasks/:taskId/verify', authenticateToken, async (req, res) => {
  try {
    console.log('[Debug] Received verify request for taskId:', req.params.taskId);
    console.log('[Debug] User data:', req.user);
    
    const { taskId } = req.params;

    // Check if user exists and has the correct role
    if (!req.user || req.user.role !== 'Reviewer') {
      console.log('[Debug] Authorization failed - User role:', req.user?.role);
      return res.status(403).json({ message: 'Only reviewers can verify tasks' });
    }

    console.log('[Debug] Checking if task exists...');
    const taskCheck = await query(
      `SELECT * FROM tasks WHERE id = $1`,
      [taskId]
    );

    console.log('[Debug] Task check result:', taskCheck.rows);

    if (taskCheck.rows.length === 0) {
      console.log('[Debug] Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    if (taskCheck.rows[0].progress !== 100) {
      console.log('[Debug] Task not completed - Progress:', taskCheck.rows[0].progress);
      return res.status(400).json({ message: 'Only completed tasks can be verified' });
    }

    console.log('[Debug] Updating task verification status...');
    const result = await query(
      `UPDATE tasks 
       SET verified = 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [taskId]
    );

    console.log('[Debug] Update result:', result.rows[0]);

    const taskResult = await query(
      `SELECT t.*, u.full_name as "assignedTo"
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $1`,
      [taskId]
    );

    console.log('[Debug] Final task result:', taskResult.rows[0]);
    res.json(taskResult.rows[0]);
  } catch (error) {
    console.error('[Debug] Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/team', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT id, full_name, role, email FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 