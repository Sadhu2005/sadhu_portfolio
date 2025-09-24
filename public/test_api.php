<?php
// Simple API test endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    require_once 'db.config.php';
    
    $stmt = $pdo->query("SELECT * FROM certificates ORDER BY created_at DESC");
    $certificates = $stmt->fetchAll();
    
    // Ensure caption field is included
    foreach ($certificates as &$cert) {
        if (!isset($cert['caption'])) {
            $cert['caption'] = '';
        }
    }
    
    echo json_encode([
        'success' => true,
        'count' => count($certificates),
        'certificates' => $certificates
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
