-- Fix missing full_name column in users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Ensure data integrity for existing rows so we can apply NOT NULL
UPDATE users SET full_name = 'Admin User' WHERE full_name IS NULL;

-- Enforce NOT NULL constraint on full_name
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;

-- Add missing last_login column
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Fix potential null passwords that might fail Hibernate compilation
UPDATE users SET password = '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRlg/slj/iC1c.jR8n.e8/a.w.q' WHERE password IS NULL; -- hash for 'admin123'
ALTER TABLE users ALTER COLUMN password SET NOT NULL;
