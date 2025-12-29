<?php
/**
 * Database Configuration File
 * Course: CNC111 - Web Programming
 * 
 * INSTRUCTIONS:
 * 1. Copy this file and rename it to "config.php"
 * 2. Fill in your database credentials below
 */

// Allow CORS for AJAX requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database credentials - UPDATE THESE FOR YOUR SETUP
define('DB_HOST', 'localhost');           // Your database host
define('DB_NAME', 'pawparadise');         // Your database name
define('DB_USER', 'root');                // Your database username
define('DB_PASS', '');                    // Your database password

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Create database connection
$pdo = null;
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

function sendJSON($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

