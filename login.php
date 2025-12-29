<?php
/**
 * User Login API
 * Course: CNC111 - Web Programming
 * 
 * Handles user authentication with session management
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
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';

// =====================================================
// SERVER-SIDE VALIDATION
// =====================================================

// Validate email format using regex
if (!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)) {
    sendJSON(['success' => false, 'message' => 'Please enter a valid email address']);
}

// Check password is not empty
if (empty($password)) {
    sendJSON(['success' => false, 'message' => 'Please enter your password']);
}

// =====================================================
// AUTHENTICATE USER
// =====================================================
try {
    $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Check if user exists
    if (!$user) {
        sendJSON(['success' => false, 'message' => 'Invalid email or password']);
    }
    
    // Verify password using password_verify()
    if (!password_verify($password, $user['password'])) {
        sendJSON(['success' => false, 'message' => 'Invalid email or password']);
    }
    
    // =====================================================
    // START SESSION
    // =====================================================
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    
    sendJSON([
        'success' => true,
        'message' => 'Login successful!',
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
    
} catch (PDOException $e) {
    sendJSON(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
