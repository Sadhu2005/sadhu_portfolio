<?php
// Simple file uploader for Hostinger shared hosting
// Place this file under your deployed public directory and protect it with a secret token

$token = $_POST['token'] ?? '';
if ($token !== getenv('UPLOAD_TOKEN')) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Forbidden']);
  exit;
}

if (!isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'No file']);
  exit;
}

$targetDir = __DIR__;

// subdir: 'certificates' or 'event-media/<folder>'
$subdir = $_POST['subdir'] ?? '';
if ($subdir && preg_match('/^[A-Za-z0-9_\-\/]+$/', $subdir)) {
  $targetDir = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $subdir;
}

if (!is_dir($targetDir)) {
  mkdir($targetDir, 0755, true);
}

$name = $_POST['name'] ?? $_FILES['file']['name'];
$name = preg_replace('/[^A-Za-z0-9_\-.]/', '_', $name);
$target = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;

if (!move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Upload failed']);
  exit;
}

header('Content-Type: application/json');
echo json_encode(['ok' => true, 'path' => str_replace(__DIR__, '', $target)]);
?>


