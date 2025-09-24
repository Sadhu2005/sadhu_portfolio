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
            $stmt = $pdo->query("SELECT * FROM certificates ORDER BY created_at DESC");
            $certificates = $stmt->fetchAll();
            echo json_encode($certificates);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || !isset($input['src'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                break;
            }
            
            $stmt = $pdo->prepare("INSERT INTO certificates (src, alt, `desc`, caption) VALUES (?, ?, ?, ?)");
            $stmt->execute([$input['src'], $input['alt'] ?? '', $input['desc'] ?? '', $input['caption'] ?? '']);
            $id = $pdo->lastInsertId();
            
            echo json_encode(['id' => $id, 'message' => 'Certificate added']);
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || !isset($input['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                break;
            }
            
            $stmt = $pdo->prepare("UPDATE certificates SET src=?, alt=?, `desc`=?, caption=? WHERE id=?");
            $stmt->execute([$input['src'], $input['alt'] ?? '', $input['desc'] ?? '', $input['caption'] ?? '', $input['id']]);
            
            echo json_encode(['message' => 'Certificate updated']);
            break;
            
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                break;
            }
            
            $stmt = $pdo->prepare("DELETE FROM certificates WHERE id=?");
            $stmt->execute([$id]);
            
            echo json_encode(['message' => 'Certificate deleted']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
