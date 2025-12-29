<?php
/**
 * Check Session API
 * Course: CNC111 - Web Programming
 * 
 * Checks if user is currently logged in
 */

require_once 'config.php';

// Check if user is logged in
if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
    sendJSON([
        'loggedIn' => true,
        'user' => [
            'id' => (int)$_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ]
    ]);
} else {
    sendJSON([
        'loggedIn' => false
    ]);
}
