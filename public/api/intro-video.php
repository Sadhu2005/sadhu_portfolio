<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../db.config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT * FROM intro_video ORDER BY id DESC LIMIT 1");
            $video = $stmt->fetch();
            echo json_encode($video ?: ['src' => '', 'poster' => '']);
            break;
            
        case 'POST':
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input || !isset($input['src'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                break;
            }
            
            // Check if record exists
            $stmt = $pdo->query("SELECT id FROM intro_video LIMIT 1");
            $existing = $stmt->fetch();
            
            if ($existing) {
                $stmt = $pdo->prepare("UPDATE intro_video SET src=?, poster=? WHERE id=?");
                $stmt->execute([$input['src'], $input['poster'] ?? '', $existing['id']]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO intro_video (src, poster) VALUES (?, ?)");
                $stmt->execute([$input['src'], $input['poster'] ?? '']);
            }
            
            echo json_encode(['message' => 'Intro video updated']);
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
