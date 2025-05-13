-- Create discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  started_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subdiscussions table
CREATE TABLE IF NOT EXISTS subdiscussions (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  subdiscussion_id INTEGER REFERENCES subdiscussions(id) ON DELETE CASCADE,
  author VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_discussion_id ON messages(discussion_id);
CREATE INDEX IF NOT EXISTS idx_messages_subdiscussion_id ON messages(subdiscussion_id);
CREATE INDEX IF NOT EXISTS idx_subdiscussions_discussion_id ON subdiscussions(discussion_id);
