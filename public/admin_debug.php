<?php
// Simple diagnostic version of admin.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Admin Debug</h1>";

// Test 1: Basic PHP
echo "<h2>✅ PHP is working</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "PHP Version ID: " . PHP_VERSION_ID . "<br>";

// Test 2: Session
try {
    session_start();
    echo "<h2>✅ Session started</h2>";
} catch (Exception $e) {
    echo "<h2>❌ Session error: " . $e->getMessage() . "</h2>";
}

// Test 3: File permissions
echo "<h2>File System Tests</h2>";
echo "Current directory: " . __DIR__ . "<br>";
echo "Directory writable: " . (is_writable(__DIR__) ? "Yes" : "No") . "<br>";
echo "Directory readable: " . (is_readable(__DIR__) ? "Yes" : "No") . "<br>";

// Test 4: Required files
echo "<h2>Required Files</h2>";
$files = ['upload.secret.php', 'db.config.php'];
foreach ($files as $file) {
    $path = __DIR__ . '/' . $file;
    echo "$file: " . (file_exists($path) ? "✅ Exists" : "❌ Missing") . "<br>";
}

// Test 5: Database connection
echo "<h2>Database Test</h2>";
if (file_exists(__DIR__ . '/db.config.php')) {
    try {
        include __DIR__ . '/db.config.php';
        if (isset($pdo)) {
            echo "✅ Database connection successful<br>";
        } else {
            echo "❌ Database connection failed - \$pdo not set<br>";
        }
    } catch (Exception $e) {
        echo "❌ Database error: " . $e->getMessage() . "<br>";
    }
} else {
    echo "ℹ️ No database config found (this is OK for JSON mode)<br>";
}

// Test 6: Upload token
echo "<h2>Upload Token Test</h2>";
$envToken = getenv('UPLOAD_TOKEN');
if (file_exists(__DIR__ . '/upload.secret.php')) {
    try {
        include __DIR__ . '/upload.secret.php';
        if (isset($UPLOAD_TOKEN)) {
            echo "✅ Upload token configured<br>";
        } else {
            echo "❌ Upload token not set in file<br>";
        }
    } catch (Exception $e) {
        echo "❌ Error loading upload token: " . $e->getMessage() . "<br>";
    }
} else {
    echo "❌ upload.secret.php file missing<br>";
}

// Test 7: Create directories
echo "<h2>Directory Creation Test</h2>";
$dirs = ['certificates', 'data', 'event-media'];
foreach ($dirs as $dir) {
    $path = __DIR__ . '/' . $dir;
    if (!is_dir($path)) {
        if (mkdir($path, 0755, true)) {
            echo "✅ Created directory: $dir<br>";
        } else {
            echo "❌ Failed to create directory: $dir<br>";
        }
    } else {
        echo "✅ Directory exists: $dir<br>";
    }
}

echo "<h2>Next Steps</h2>";
echo "<p>If all tests pass, try accessing <a href='admin.php'>admin.php</a></p>";
echo "<p>If there are errors, fix them first before using the admin panel.</p>";
?>
