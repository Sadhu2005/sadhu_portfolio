<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.config.php';

try {
    if (!$pdo) {
        throw new Exception("Database connection failed");
    }
    
    $stmt = $pdo->query("
        SELECT a.*, 
               GROUP_CONCAT(am.url ORDER BY am.id) as media_urls
        FROM achievements a 
        LEFT JOIN achievement_media am ON a.id = am.achievement_id 
        GROUP BY a.id 
        ORDER BY a.created_at DESC
    ");
    $achievements = $stmt->fetchAll();
    
    // Process media URLs
    foreach ($achievements as &$achievement) {
        $achievement['media'] = $achievement['media_urls'] ? 
            array_values(array_filter(explode(',', $achievement['media_urls']))) : [];
        unset($achievement['media_urls']);
    }
    
    echo json_encode([
        'success' => true,
        'count' => count($achievements),
        'achievements' => $achievements
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
