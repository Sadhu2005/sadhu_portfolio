<?php
// Migration script to add caption column to certificates table
// Run this once to update your existing database

require_once 'db.config.php';

try {
    // Check if caption column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM certificates LIKE 'caption'");
    $columnExists = $stmt->fetch();
    
    if (!$columnExists) {
        // Add caption column
        $pdo->exec("ALTER TABLE certificates ADD COLUMN caption VARCHAR(200) DEFAULT '' AFTER `desc`");
        echo "✅ Caption column added to certificates table\n";
    } else {
        echo "ℹ️ Caption column already exists in certificates table\n";
    }
    
    echo "✅ Database migration completed successfully\n";
    
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
}
?>
