<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../db.config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
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
            
            echo json_encode($achievements);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || !isset($input['eventName'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                break;
            }
            
            $pdo->beginTransaction();
            
            $stmt = $pdo->prepare("INSERT INTO achievements (eventName, `date`, outcome, description, techUsed, certificateUrl) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['eventName'], 
                $input['date'] ?? '', 
                $input['outcome'] ?? '', 
                $input['description'] ?? '', 
                $input['techUsed'] ?? '', 
                $input['certificateUrl'] ?? ''
            ]);
            $id = $pdo->lastInsertId();
            
            // Add media
            if (isset($input['media']) && is_array($input['media'])) {
                $stmt = $pdo->prepare("INSERT INTO achievement_media (achievement_id, url) VALUES (?, ?)");
                foreach ($input['media'] as $url) {
                    $stmt->execute([$id, $url]);
                }
            }
            
            $pdo->commit();
            echo json_encode(['id' => $id, 'message' => 'Achievement added']);
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || !isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                break;
            }
            
            $pdo->beginTransaction();
            
            $stmt = $pdo->prepare("UPDATE achievements SET eventName=?, `date`=?, outcome=?, description=?, techUsed=?, certificateUrl=? WHERE id=?");
            $stmt->execute([
                $input['eventName'], 
                $input['date'] ?? '', 
                $input['outcome'] ?? '', 
                $input['description'] ?? '', 
                $input['techUsed'] ?? '', 
                $input['certificateUrl'] ?? '', 
                $input['id']
            ]);
            
            // Update media
            $pdo->prepare("DELETE FROM achievement_media WHERE achievement_id=?")->execute([$input['id']]);
            if (isset($input['media']) && is_array($input['media'])) {
                $stmt = $pdo->prepare("INSERT INTO achievement_media (achievement_id, url) VALUES (?, ?)");
                foreach ($input['media'] as $url) {
                    $stmt->execute([$input['id'], $url]);
                }
            }
            
            $pdo->commit();
            echo json_encode(['message' => 'Achievement updated']);
            break;
            
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                break;
            }
            
            $pdo->beginTransaction();
            $pdo->prepare("DELETE FROM achievement_media WHERE achievement_id=?")->execute([$id]);
            $pdo->prepare("DELETE FROM achievements WHERE id=?")->execute([$id]);
            $pdo->commit();
            
            echo json_encode(['message' => 'Achievement deleted']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>