<?php
// Minimal admin.php for testing
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

// Simple token check
$token = 'admin123'; // Change this to your desired password

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if ($_POST['password'] === $token) {
        $_SESSION['admin_ok'] = true;
        header('Location: ' . $_SERVER['REQUEST_URI']);
        exit;
    } else {
        $error = 'Invalid password';
    }
}

// Handle logout
if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
}

// Check if logged in
$isLoggedIn = isset($_SESSION['admin_ok']) && $_SESSION['admin_ok'] === true;

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Simple Admin</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .form { border: 1px solid #ddd; padding: 20px; margin: 20px 0; }
        input, button { padding: 8px; margin: 5px 0; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>

<?php if (!$isLoggedIn): ?>
    <h1>Admin Login</h1>
    <?php if (isset($error)): ?>
        <p class="error"><?= htmlspecialchars($error) ?></p>
    <?php endif; ?>
    
    <form method="post" class="form">
        <label>Password:</label><br>
        <input type="password" name="password" required><br>
        <button type="submit">Login</button>
    </form>
    
    <p><small>Default password: admin123 (change this in the code)</small></p>

<?php else: ?>
    <h1>Admin Panel</h1>
    <p><a href="?logout=1">Logout</a></p>
    
    <div class="success">
        <h2>✅ Admin panel is working!</h2>
        <p>This means PHP, sessions, and basic functionality are working.</p>
    </div>
    
    <h2>System Info</h2>
    <ul>
        <li>PHP Version: <?= phpversion() ?></li>
        <li>Current Directory: <?= __DIR__ ?></li>
        <li>Directory Writable: <?= is_writable(__DIR__) ? 'Yes' : 'No' ?></li>
        <li>Upload Max Size: <?= ini_get('upload_max_filesize') ?></li>
    </ul>
    
    <h2>Next Steps</h2>
    <p>If this works, the issue is likely in the main admin.php file. Try:</p>
    <ol>
        <li>Check the <a href="admin_debug.php">debug page</a> for specific errors</li>
        <li>Compare with the main <a href="admin.php">admin.php</a> file</li>
    </ol>

<?php endif; ?>

</body>
</html>
