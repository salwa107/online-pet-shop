<?php
/**
 * User Signup API
 * Course: CNC111 - Web Programming
 * 
 * Handles new user registration with validation
 */

require_once 'config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'message' => 'Invalid request method']);
}

// Get JSON input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Check if JSON was parsed correctly
if ($input === null) {
    sendJSON(['success' => false, 'message' => 'Invalid JSON data']);
}

// Extract and sanitize input
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';

// =====================================================
// SERVER-SIDE VALIDATION
// =====================================================

// Validate name (minimum 3 characters)
if (strlen($name) < 3) {
    sendJSON(['success' => false, 'message' => 'Name must be at least 3 characters']);
}

// Validate name (letters and spaces only)
if (!preg_match('/^[a-zA-Z\s]+$/', $name)) {
    sendJSON(['success' => false, 'message' => 'Name can only contain letters and spaces']);
}

// Validate email format using regex
if (!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)) {
    sendJSON(['success' => false, 'message' => 'Please enter a valid email address']);
}

// Validate password (minimum 6 characters)
if (strlen($password) < 6) {
    sendJSON(['success' => false, 'message' => 'Password must be at least 6 characters']);
}

// =====================================================
// CHECK IF EMAIL EXISTS
// =====================================================
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        sendJSON(['success' => false, 'message' => 'Email already registered. Please login instead.']);
    }
} catch (PDOException $e) {
    sendJSON(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// =====================================================
// CREATE NEW USER
// =====================================================
try {
    // Hash password securely using password_hash()
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $hashedPassword]);
    
    // Get the new user ID
    $userId = $pdo->lastInsertId();
    
    // Start session for the new user
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    sendJSON([
        'success' => true,
        'message' => 'Account created successfully!',
        'user' => [
            'id' => (int)$userId,
            'name' => $name,
            'email' => $email
        ]
    ]);
    
} catch (PDOException $e) {
    sendJSON(['success' => false, 'message' => 'Failed to create account: ' . $e->getMessage()]);
}
