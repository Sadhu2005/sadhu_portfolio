<?php
// Simple file uploader for Hostinger shared hosting
// Supports: token via env UPLOAD_TOKEN or local file upload.secret.php ($UPLOAD_TOKEN)

// If opened via GET, render a tiny HTML form for mobile uploads
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  header('Content-Type: text/html; charset=utf-8');
  echo '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">'
     . '<title>Secure Upload</title>'
     . '<style>body{font-family:sans-serif;margin:20px}label{display:block;margin:10px 0 4px}input,button{font-size:16px;padding:8px;width:100%;max-width:480px}</style>'
     . '</head><body>'
     . '<h3>Upload to site</h3>'
     . '<form method="post" enctype="multipart/form-data">'
     . '<label>Token</label><input name="token" type="password" required />'
     . '<label>Subdir (e.g. certificates or event-media/symbiot-2025)</label><input name="subdir" type="text" placeholder="certificates" />'
     . '<label>File</label><input name="file" type="file" accept="image/*,video/*,application/json" required />'
     . '<label>Save as (optional)</label><input name="name" type="text" placeholder="auto from file" />'
     . '<button type="submit">Upload</button>'
     . '</form>'
     . '</body></html>';
  exit;
}

header('Content-Type: application/json');

// Resolve token from env or local include
$envToken = getenv('UPLOAD_TOKEN');
if (file_exists(__DIR__ . '/upload.secret.php')) {
  include __DIR__ . '/upload.secret.php'; // should define $UPLOAD_TOKEN
}
$configuredToken = isset($UPLOAD_TOKEN) && is_string($UPLOAD_TOKEN) ? $UPLOAD_TOKEN : $envToken;

$token = $_POST['token'] ?? '';
if (!$configuredToken || !hash_equals((string)$configuredToken, (string)$token)) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Forbidden: invalid token']);
  exit;
}

if (!isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'No file']);
  exit;
}

$targetDir = __DIR__;

// subdir: 'certificates' or 'event-media/<folder>' or 'data'
$subdir = $_POST['subdir'] ?? '';
if ($subdir && preg_match('/^[A-Za-z0-9_\-\/]+$/', $subdir)) {
  $targetDir = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $subdir;
}

if (!is_dir($targetDir)) {
  if (!mkdir($targetDir, 0755, true)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Cannot create target directory']);
    exit;
  }
}

$name = $_POST['name'] ?? $_FILES['file']['name'];
$name = preg_replace('/[^A-Za-z0-9_\-.]/', '_', $name);
$target = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;

// Basic size limit (200MB)
if (!empty($_FILES['file']['size']) && $_FILES['file']['size'] > 200 * 1024 * 1024) {
  http_response_code(413);
  echo json_encode(['ok' => false, 'error' => 'File too large']);
  exit;
}

if (!move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Upload failed']);
  exit;
}

echo json_encode(['ok' => true, 'path' => str_replace(__DIR__, '', $target)]);
?>


