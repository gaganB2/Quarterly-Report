
-- DROP AND CREATE DATABASE MANUALLY OUTSIDE THIS SCRIPT IF NEEDED
-- CREATE DATABASE qr_db;
-- CREATE USER qr_user WITH PASSWORD 'qr_pass';
-- GRANT ALL PRIVILEGES ON DATABASE qr_db TO qr_user;

-- Create tables
CREATE TABLE auth_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_staff BOOLEAN NOT NULL,
    is_active BOOLEAN NOT NULL,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE users_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES auth_user(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    department_id INTEGER
);

CREATE TABLE t1_research_department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE t1_research_t1_researcharticle (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth_user(id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES t1_research_department(id) ON DELETE CASCADE,
    title VARCHAR(255),
    journal_name VARCHAR(255),
    publication_date DATE,
    issn_number VARCHAR(20),
    indexing VARCHAR(100),
    impact_factor VARCHAR(50),
    co_authors TEXT,
    document_link TEXT,
    quarter VARCHAR(10),
    year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add admin user (password hash must match expected Django format)
INSERT INTO auth_user (
    password, is_superuser, username, first_name, last_name,
    email, is_staff, is_active, date_joined
) VALUES (
    'pbkdf2_sha256$600000$sample$fakehash', -- Placeholder
    TRUE, 'admin', 'Admin', 'User', 'admin@example.com', TRUE, TRUE, now()
);

-- Add faculty user
INSERT INTO auth_user (
    password, is_superuser, username, first_name, last_name,
    email, is_staff, is_active, date_joined
) VALUES (
    'pbkdf2_sha256$600000$sample$fakehash', -- Placeholder
    FALSE, 'faculty1', 'Faculty', 'User', 'faculty@example.com', FALSE, TRUE, now()
);

-- Insert department
INSERT INTO t1_research_department (name) VALUES ('Computer Science');

-- Map faculty to department
INSERT INTO users_profile (user_id, role, department_id)
SELECT id, 'Faculty', 1 FROM auth_user WHERE username = 'faculty1';
