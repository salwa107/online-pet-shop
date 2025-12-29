-- =====================================================
-- PawParadise Pet Shop Database Schema
-- Course: CNC111 - Web Programming
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS pawparadise;
USE pawparadise;

-- =====================================================
-- TABLE: users
-- Stores registered user accounts
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: orders
-- Stores customer orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(500) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'cod',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- Sample user for testing (password: test123)
-- =====================================================
-- INSERT INTO users (name, email, password) VALUES 
-- ('Test User', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

