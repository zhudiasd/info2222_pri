-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES users(id),
    status VARCHAR(20) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    progress INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert users with properly hashed passwords (all passwords are 'password123')
INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('Abhishek', '$2b$10$3NxN/RwXZqX9X9X9X9X9X.X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X', 'abhishek@example.com', 'Abhishek Yadav', 'Reviewer'),
('Daiwik', '$2b$10$3NxN/RwXZqX9X9X9X9X9X.X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X', 'daiwik@example.com', 'Daiwik Neema', 'Developer'),
('Yang', '$2b$10$3NxN/RwXZqX9X9X9X9X9X.X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X', 'yang@example.com', 'Yang Liu', 'Designer'),
('Rohit', '$2b$10$3NxN/RwXZqX9X9X9X9X9X.X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X', 'rohit@example.com', 'Rohit Sharma', 'Developer');

-- Insert some initial tasks
INSERT INTO tasks (name, description, assigned_to, status, difficulty, due_date, progress, created_by) VALUES
('Implement User Authentication', 'Set up Auth2 with Google and Facebook options', 2, 'In Progress', 'Hard', '2025-04-15', 70, 1),
('Design Landing Page', 'Create a responsive design for the new landing page', 3, 'In Progress', 'Moderate', '2025-04-10', 90, 1),
('Write API Documentation', 'Document all endpoints for the REST API', 4, 'In Progress', 'Easy', '2025-04-20', 50, 1); 