<?php
/**
 * User Logout API
 * Course: CNC111 - Web Programming
 * 
 * Destroys user session and logs out
 */

require_once 'config.php';

// Destroy all session data
$_SESSION = [];

// Destroy the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy the session
session_destroy();

// Return success response
sendJSON([
    'success' => true,
    'message' => 'Logged out successfully'
]);
