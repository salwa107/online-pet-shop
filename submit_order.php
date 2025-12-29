<?php
/**
 * Order Submission API
 * Course: CNC111 - Web Programming
 * 
 * Handles order placement with authentication check
 */

require_once 'config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSON(['success' => false, 'message' => 'Invalid request method']);
}

// =====================================================
// CHECK IF USER IS LOGGED IN
// =====================================================
if (!isset($_SESSION['user_id'])) {
    sendJSON([
        'success' => false,
        'message' => 'Please login to place an order',
        'requireLogin' => true
    ]);
}

// Get JSON input
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Check if JSON was parsed correctly
if ($input === null) {
    sendJSON(['success' => false, 'message' => 'Invalid JSON data']);
}

// Extract order data
$name = isset($input['name']) ? trim($input['name']) : '';
$phone = isset($input['phone']) ? trim($input['phone']) : '';
$address = isset($input['address']) ? trim($input['address']) : '';
$total = isset($input['total']) ? floatval($input['total']) : 0;
$paymentMethod = isset($input['paymentMethod']) ? $input['paymentMethod'] : 'cod';

// =====================================================
// SERVER-SIDE VALIDATION
// =====================================================

// Validate name (minimum 3 characters)
if (strlen($name) < 3) {
    sendJSON(['success' => false, 'message' => 'Please enter your full name']);
}

// Validate phone using regex (at least 10 digits)
$phoneDigits = preg_replace('/[^0-9]/', '', $phone);
if (strlen($phoneDigits) < 10) {
    sendJSON(['success' => false, 'message' => 'Please enter a valid phone number (at least 10 digits)']);
}

// Validate address (minimum 10 characters)
if (strlen($address) < 10) {
    sendJSON(['success' => false, 'message' => 'Please enter your complete delivery address']);
}

// Validate total amount
if ($total <= 0) {
    sendJSON(['success' => false, 'message' => 'Invalid order total']);
}

// Validate payment method
if (!in_array($paymentMethod, ['card', 'cod'])) {
    sendJSON(['success' => false, 'message' => 'Invalid payment method']);
}

// =====================================================
// INSERT ORDER INTO DATABASE
// =====================================================
try {
    $stmt = $pdo->prepare("
        INSERT INTO orders (user_id, name, phone, address, total, payment_method) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $_SESSION['user_id'],
        $name,
        $phone,
        $address,
        $total,
        $paymentMethod
    ]);
    
    $orderId = $pdo->lastInsertId();
    
    sendJSON([
        'success' => true,
        'message' => 'Order placed successfully!',
        'orderId' => (int)$orderId
    ]);
    
} catch (PDOException $e) {
    sendJSON(['success' => false, 'message' => 'Failed to place order: ' . $e->getMessage()]);
}
