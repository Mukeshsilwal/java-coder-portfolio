CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profile Table
CREATE TABLE profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    headline VARCHAR(255),
    bio TEXT,
    years_of_experience INT,
    resume_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_website TEXT,
    location VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    profile_image TEXT,
    availability_status VARCHAR(50)
);

-- 3. Skills Module
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Backend, Frontend, Database, DevOps, Tools
    proficiency_level VARCHAR(50), -- Beginner, Intermediate, Advanced, Expert
    experience_years INT,
    icon_url TEXT,
    display_order INT
);

-- 4. Projects Module
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack TEXT, -- Comma separated or JSON
    github_repo_url TEXT,
    live_demo_url TEXT,
    project_image TEXT,
    project_type VARCHAR(50), -- Personal, Client, OpenSource
    start_date DATE,
    end_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Experience Module
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50), -- Full-Time, Internship, Freelance
    start_date DATE,
    end_date DATE,
    description TEXT,
    technologies_used TEXT
);

-- 6. Education Module
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_year INT,
    end_year INT,
    grade VARCHAR(50),
    description TEXT
);

-- 7. Certifications
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    credential_url TEXT
);

-- 8. Contact Messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- 9. Blogs
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    thumbnail TEXT,
    published_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'DRAFT', -- Draft, Published
    views INT DEFAULT 0
);
