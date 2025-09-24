<?php
// PHP 5.6+ compatible admin panel
session_start();

// Load token from env or adjacent secret file
$envToken = getenv('UPLOAD_TOKEN');
$configuredToken = $envToken;
if (file_exists(__DIR__ . '/upload.secret.php')) {
  include __DIR__ . '/upload.secret.php';
  if (isset($UPLOAD_TOKEN) && is_string($UPLOAD_TOKEN)) {
    $configuredToken = $UPLOAD_TOKEN;
  }
}
// Normalize tokens to avoid issues with stray whitespace/BOM
if (is_string($configuredToken)) { 
  $configuredToken = trim($configuredToken); 
}

// Load database config if available
$pdo = null;
if (file_exists(__DIR__ . '/db.config.php')) {
  try {
    include __DIR__ . '/db.config.php';
  } catch (Exception $e) {
    error_log("DB config failed: " . $e->getMessage());
  }
}

function html_header($title = 'Admin') {
  echo '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">'
     . '<meta charset="utf-8"><title>' . htmlspecialchars($title) . '</title>'
     . '<style>body{font-family:sans-serif;margin:16px;max-width:820px}h2{margin-top:28px}form{margin:12px 0;padding:12px;border:1px solid #ddd;border-radius:8px}label{display:block;margin:10px 0 4px}input,textarea,button,select{font-size:16px;padding:8px;width:100%;box-sizing:border-box}small{color:#666}code{background:#f5f5f5;padding:2px 4px;border-radius:4px}nav a{margin-right:8px}</style>'
     . '</head><body>';
}

function html_footer() { 
  echo '</body></html>'; 
}

function is_authed() {
  return isset($_SESSION['admin_ok']) && $_SESSION['admin_ok'] === true;
}

// Handle logout
if (isset($_GET['logout'])) {
  $_SESSION = array();
  session_destroy();
  header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
  exit;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
  $pass = isset($_POST['password']) ? trim((string)$_POST['password']) : '';
  if ($configuredToken && hash_equals((string)$configuredToken, (string)$pass)) {
    $_SESSION['admin_ok'] = true;
  } else {
    $_SESSION['admin_ok'] = false;
    $_SESSION['err'] = 'Invalid password';
  }
  header('Location: ' . $_SERVER['REQUEST_URI']);
  exit;
}

// Helpers
function ensure_subdir($subdir) {
  $base = __DIR__;
  if ($subdir && preg_match('/^[A-Za-z0-9_\-\/]+$/', $subdir)) {
    $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $subdir;
  }
  if (!is_dir($base)) { 
    mkdir($base, 0755, true); 
  }
  return $base;
}

function append_json_row($file, $row) {
  $data = array();
  if (file_exists($file)) {
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    if (!is_array($data)) { 
      $data = array(); 
    }
  }
  $data[] = $row;
  return (bool)file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Handle actions (only if authed)
if (is_authed() && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $act = $_POST['action'];
  
  // Upload file (image/video/json)
  if ($act === 'upload' && isset($_FILES['file'])) {
    $subdir = trim((string)($_POST['subdir']));
    $targetDir = ensure_subdir($subdir);
    $name = $_POST['name'] ? $_POST['name'] : $_FILES['file']['name'];
    $name = preg_replace('/[^A-Za-z0-9_\-.]/', '_', $name);
    $target = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;
    
    // Enhanced error checking
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
      $_SESSION['err'] = 'Upload error: ' . $_FILES['file']['error'];
    } elseif (!empty($_FILES['file']['size']) && $_FILES['file']['size'] > 200 * 1024 * 1024) {
      $_SESSION['err'] = 'File too large (max 200MB)';
    } elseif (!is_uploaded_file($_FILES['file']['tmp_name'])) {
      $_SESSION['err'] = 'Invalid upload file';
    } elseif (!move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
      $_SESSION['err'] = 'Upload failed - check directory permissions';
    } else {
      $_SESSION['ok'] = 'Uploaded to ' . str_replace(__DIR__, '', $target);
      $_SESSION['last_src'] = '/' . ltrim(str_replace(__DIR__, '', $target), '/');
    }
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
  }

  // Add certificate (JSON fallback)
  if ($act === 'add_certificate') {
    $row = array(
      'src' => (string)($_POST['c_src']),
      'alt' => (string)($_POST['c_alt']),
      'desc' => (string)($_POST['c_desc']),
      'caption' => (string)($_POST['c_caption']),
    );
    $file = __DIR__ . '/data/certificates.json';
    ensure_subdir('data');
    if ($row['src'] && append_json_row($file, $row)) { 
      $_SESSION['ok'] = 'Certificate added to JSON'; 
    } else { 
      $_SESSION['err'] = 'Could not update certificates.json'; 
    }
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
  }
}

// Views
if (!is_authed()) {
  html_header('Admin Login');
  echo '<h2>Admin Login</h2>';
  if (!empty($_SESSION['err'])) { 
    echo '<p style="color:#b00">' . htmlspecialchars($_SESSION['err']) . '</p>'; 
    unset($_SESSION['err']); 
  }
  echo '<form method="post"><input type="hidden" name="action" value="login" />'
     . '<label>Password</label><input type="password" name="password" required />'
     . '<button type="submit">Login</button></form>';
  echo '<p><small>Tip: same secret as upload.php token. Ensure the file upload.secret.php is next to this file and contains $UPLOAD_TOKEN=\'your-secret\';</small></p>';
  html_footer();
  exit;
}

html_header('Admin');
echo '<nav><a href="?logout=1">Logout</a></nav>';
if (!empty($_SESSION['ok'])) { 
  echo '<p style="color:#060">' . htmlspecialchars($_SESSION['ok']) . '</p>'; 
  unset($_SESSION['ok']); 
}
if (!empty($_SESSION['err'])) { 
  echo '<p style="color:#b00">' . htmlspecialchars($_SESSION['err']) . '</p>'; 
  unset($_SESSION['err']); 
}

// Simple step selector
$type = isset($_GET['type']) ? (string)$_GET['type'] : '';
$stage = isset($_GET['stage']) ? (int)$_GET['stage'] : 1;
$lastSrc = isset($_SESSION['last_src']) ? (string)$_SESSION['last_src'] : '';

echo '<h2>Step 1: Choose what to update</h2>';
echo '<form method="get" style="display:flex;gap:8px;align-items:flex-end">'
   . '<label style="flex:1">Section<select name="type"><option value="cert"' . ($type==='cert'?' selected':'') . '>Certificates</option></select></label>'
   . '<input type="hidden" name="stage" value="1" />'
   . '<button type="submit">Continue</button>'
   . '</form>';

if ($type === 'cert') {
  echo '<h2>Certificates</h2>';
  if ($stage === 1) {
    echo '<h3>Stage 1: Upload certificate image</h3>';
    echo '<form method="post" enctype="multipart/form-data">'
       . '<input type="hidden" name="action" value="upload" />'
       . '<input type="hidden" name="name" value="" />'
       . '<label>Subdir</label><input name="subdir" type="text" value="certificates" readonly />'
       . '<label>Image</label><input name="file" type="file" accept="image/*" required />'
       . '<button type="submit">Upload</button>'
       . '</form>';
    echo '<div style="margin-top:12px;padding:8px;background:#f5f5f5;border-radius:4px">';
    echo '<small><strong>Debug Info:</strong><br>';
    echo 'Upload Max Filesize: ' . ini_get('upload_max_filesize') . '<br>';
    echo 'Post Max Size: ' . ini_get('post_max_size') . '<br>';
    echo 'Target Directory: ' . __DIR__ . '/certificates<br>';
    echo 'Directory Writable: ' . (is_writable(__DIR__ . '/certificates') ? 'Yes' : 'No') . '</small>';
    echo '</div>';
    if ($lastSrc) {
      echo '<p><small>Last upload: <code>' . htmlspecialchars($lastSrc) . '</code></small></p>';
      echo '<a class="button" href="?type=cert&stage=2" style="display:inline-block;padding:8px 12px;border:1px solid #ddd;border-radius:6px">Go to Stage 2</a>';
    }
  } elseif ($stage === 2) {
    echo '<h3>Stage 2: Add details and save</h3>';
    echo '<form method="post">'
       . '<input type="hidden" name="action" value="add_certificate" />'
       . '<label>Image path (src)</label><input name="c_src" type="text" value="' . htmlspecialchars($lastSrc) . '" required />'
       . '<label>Title (alt)</label><input name="c_alt" type="text" placeholder="Certificate title" />'
       . '<label>Short description (desc)</label><textarea name="c_desc" rows="3" placeholder="Brief description of the certificate"></textarea>'
       . '<label>Caption (for display)</label><input name="c_caption" type="text" placeholder="Short caption for the certificate" />'
       . '<button type="submit">Save certificate</button>'
       . '</form>';
    echo '<div style="margin-top:12px"><a href="?type=cert&stage=1" style="display:inline-block;padding:8px 12px;border:1px solid #ddd;border-radius:6px">Add one more</a></div>';
  }
}

// Show current certificates from JSON
echo '<h2>Current Certificates</h2>';
$certFile = __DIR__ . '/data/certificates.json';
if (file_exists($certFile)) {
  $certData = json_decode(file_get_contents($certFile), true);
  if ($certData && is_array($certData)) {
    foreach ($certData as $index => $cert) {
      echo '<div style="border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:4px">';
      echo '<strong>' . htmlspecialchars($cert['alt']) . '</strong><br>';
      echo '<small>src: ' . htmlspecialchars($cert['src']) . '</small><br>';
      echo '<small>desc: ' . htmlspecialchars($cert['desc']) . '</small><br>';
      echo '<small>caption: ' . htmlspecialchars($cert['caption']) . '</small><br>';
      echo '<small>Index: ' . $index . '</small>';
      echo '</div>';
    }
  } else {
    echo '<p><em>No certificates in JSON file</em></p>';
  }
} else {
  echo '<h3>Certificates</h3><p><em>No certificates.json file found</em></p>';
}

html_footer();
?>
