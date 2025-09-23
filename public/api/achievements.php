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
            
            // Convert media_urls string to array
            foreach ($achievements as &$achievement) {
                $achievement['media'] = $achievement['media_urls'] ? explode(',', $achievement['media_urls']) : [];
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
            $achievement_id = $pdo->lastInsertId();
            
            // Add media if provided
            if (isset($input['media']) && is_array($input['media'])) {
                $stmt = $pdo->prepare("INSERT INTO achievement_media (achievement_id, url) VALUES (?, ?)");
                foreach ($input['media'] as $url) {
                    if (trim($url)) {
                        $stmt->execute([$achievement_id, trim($url)]);
                    }
                }
            }
            
            $pdo->commit();
            echo json_encode(['id' => $achievement_id, 'message' => 'Achievement added']);
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
            if (isset($input['media']) && is_array($input['media'])) {
                $pdo->prepare("DELETE FROM achievement_media WHERE achievement_id=?")->execute([$input['id']]);
                $stmt = $pdo->prepare("INSERT INTO achievement_media (achievement_id, url) VALUES (?, ?)");
                foreach ($input['media'] as $url) {
                    if (trim($url)) {
                        $stmt->execute([$input['id'], trim($url)]);
                    }
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
            
            $stmt = $pdo->prepare("DELETE FROM achievements WHERE id=?");
            $stmt->execute([$id]);
            
            echo json_encode(['message' => 'Achievement deleted']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
