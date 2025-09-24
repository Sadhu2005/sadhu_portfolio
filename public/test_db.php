<?php
// Simple database connection test
header('Content-Type: text/plain');

try {
    require_once 'db.config.php';
    
    echo "✅ Database connection successful\n";
    
    // Test certificates table
    $stmt = $pdo->query("DESCRIBE certificates");
    $columns = $stmt->fetchAll();
    echo "📋 Certificates table columns:\n";
    foreach ($columns as $col) {
        echo "  - " . $col['Field'] . " (" . $col['Type'] . ")\n";
    }
    
    // Check if caption column exists
    $hasCaption = false;
    foreach ($columns as $col) {
        if ($col['Field'] === 'caption') {
            $hasCaption = true;
            break;
        }
    }
    
    if ($hasCaption) {
        echo "✅ Caption column exists\n";
    } else {
        echo "❌ Caption column missing - run migration\n";
    }
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM certificates");
    $result = $stmt->fetch();
    echo "📊 Total certificates in database: " . $result['count'] . "\n";
    
    // Show recent certificates
    $stmt = $pdo->query("SELECT id, src, alt, caption FROM certificates ORDER BY created_at DESC LIMIT 5");
    $certs = $stmt->fetchAll();
    echo "📄 Recent certificates:\n";
    foreach ($certs as $cert) {
        echo "  - ID: {$cert['id']}, Src: {$cert['src']}, Alt: {$cert['alt']}, Caption: {$cert['caption']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
?>
