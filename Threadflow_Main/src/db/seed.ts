import bcrypt from 'bcrypt';
import { query } from './db';

async function seedDatabase() {
  try {
    // Check if data already exists
    const tasksResult = await query('SELECT COUNT(*) FROM tasks');
    const usersResult = await query('SELECT COUNT(*) FROM users');
    
    // Only proceed with seeding if tables are empty
    if (parseInt(tasksResult.rows[0].count) > 0 || parseInt(usersResult.rows[0].count) > 0) {
      console.log('Database already has data. Skipping seed operation.');
      return;
    }
    
    // Clear existing data if needed
    await query('DELETE FROM tasks');
    await query('DELETE FROM users');

    // Hash password
    const password = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert users
    const users = [
      {
        username: 'Abhishek',
        email: 'abhishek@example.com',
        full_name: 'Abhishek Yadav',
        role: 'Reviewer'
      },
      {
        username: 'Daiwik',
        email: 'daiwik@example.com',
        full_name: 'Daiwik Neema',
        role: 'Developer'
      },
      {
        username: 'Yang',
        email: 'yang@example.com',
        full_name: 'Yang Liu',
        role: 'Designer'
      },
      {
        username: 'Rohit',
        email: 'rohit@example.com',
        full_name: 'Rohit Sharma',
        role: 'Developer'
      }
    ];

    for (const user of users) {
      await query(
        'INSERT INTO users (username, password_hash, email, full_name, role) VALUES ($1, $2, $3, $4, $5)',
        [user.username, passwordHash, user.email, user.full_name, user.role]
      );
    }

    // Insert tasks
    const tasks = [
      {
        name: 'Implement User Authentication',
        description: 'Set up Auth2 with Google and Facebook options',
        assigned_to: 2,
        status: 'In Progress',
        difficulty: 'Hard',
        due_date: '2025-04-15',
        progress: 70,
        created_by: 1
      },
      {
        name: 'Design Landing Page',
        description: 'Create a responsive design for the new landing page',
        assigned_to: 3,
        status: 'In Progress',
        difficulty: 'Moderate',
        due_date: '2025-04-10',
        progress: 90,
        created_by: 1
      },
      {
        name: 'Write API Documentation',
        description: 'Document all endpoints for the REST API',
        assigned_to: 4,
        status: 'In Progress',
        difficulty: 'Easy',
        due_date: '2025-04-20',
        progress: 50,
        created_by: 1
      }
    ];

    for (const task of tasks) {
      await query(
        `INSERT INTO tasks (name, description, assigned_to, status, difficulty, due_date, progress, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [task.name, task.description, task.assigned_to, task.status, task.difficulty, task.due_date, task.progress, task.created_by]
      );
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase(); 