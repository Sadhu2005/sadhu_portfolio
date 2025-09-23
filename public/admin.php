<?php
session_start();

// Load token from env or adjacent secret file
$envToken = getenv('UPLOAD_TOKEN');
if (file_exists(__DIR__ . '/upload.secret.php')) {
  include __DIR__ . '/upload.secret.php'; // should define $UPLOAD_TOKEN
}
$configuredToken = isset($UPLOAD_TOKEN) && is_string($UPLOAD_TOKEN) ? $UPLOAD_TOKEN : $envToken;

function html_header($title = 'Admin') {
  echo '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">'
     . '<meta charset="utf-8"><title>' . htmlspecialchars($title) . '</title>'
     . '<style>body{font-family:sans-serif;margin:16px;max-width:820px}h2{margin-top:28px}form{margin:12px 0;padding:12px;border:1px solid #ddd;border-radius:8px}label{display:block;margin:10px 0 4px}input,textarea,button,select{font-size:16px;padding:8px;width:100%;box-sizing:border-box}small{color:#666}code{background:#f5f5f5;padding:2px 4px;border-radius:4px}nav a{margin-right:8px}</style>'
     . '</head><body>';
}

function html_footer() { echo '</body></html>'; }

function is_authed(): bool {
  return isset($_SESSION['admin_ok']) && $_SESSION['admin_ok'] === true;
}

// Handle logout
if (isset($_GET['logout'])) {
  $_SESSION = [];
  session_destroy();
  header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
  exit;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
  $pass = $_POST['password'] ?? '';
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
function ensure_subdir(string $subdir): string {
  $base = __DIR__;
  if ($subdir && preg_match('/^[A-Za-z0-9_\-\/]+$/', $subdir)) {
    $base = rtrim($base, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $subdir;
  }
  if (!is_dir($base)) { mkdir($base, 0755, true); }
  return $base;
}

function append_json_row(string $file, $row): bool {
  $data = [];
  if (file_exists($file)) {
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    if (!is_array($data)) { $data = []; }
  }
  $data[] = $row;
  return (bool)file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// Handle actions (only if authed)
if (is_authed() && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $act = $_POST['action'] ?? '';
  // Upload file (image/video/json)
  if ($act === 'upload' && isset($_FILES['file'])) {
    $subdir = trim((string)($_POST['subdir'] ?? ''));
    $targetDir = ensure_subdir($subdir);
    $name = $_POST['name'] ?? $_FILES['file']['name'];
    $name = preg_replace('/[^A-Za-z0-9_\-.]/', '_', $name);
    $target = rtrim($targetDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;
    if (!empty($_FILES['file']['size']) && $_FILES['file']['size'] > 200 * 1024 * 1024) {
      $_SESSION['err'] = 'File too large';
    } elseif (!move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
      $_SESSION['err'] = 'Upload failed';
    } else {
      $_SESSION['ok'] = 'Uploaded to ' . str_replace(__DIR__, '', $target);
      $_SESSION['last_src'] = '/' . ltrim(str_replace(__DIR__, '', $target), '/');
    }
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
  }

  // Append certificate JSON row
  if ($act === 'add_certificate') {
    $row = [
      'src' => (string)($_POST['c_src'] ?? ''),
      'alt' => (string)($_POST['c_alt'] ?? ''),
      'desc' => (string)($_POST['c_desc'] ?? ''),
    ];
    $file = __DIR__ . '/data/certificates.json';
    ensure_subdir('data');
    if ($row['src'] && append_json_row($file, $row)) { $_SESSION['ok'] = 'Certificate added'; }
    else { $_SESSION['err'] = 'Could not update certificates.json'; }
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
  }

  // Append achievement JSON row
  if ($act === 'add_achievement') {
    $mediaRaw = (string)($_POST['a_media'] ?? '');
    $media = array_values(array_filter(array_map('trim', explode(',', $mediaRaw)), fn($v) => $v !== ''));
    $row = [
      'eventName' => (string)($_POST['a_event'] ?? ''),
      'date' => (string)($_POST['a_date'] ?? ''),
      'outcome' => (string)($_POST['a_outcome'] ?? ''),
      'description' => (string)($_POST['a_desc'] ?? ''),
      'techUsed' => (string)($_POST['a_tech'] ?? ''),
      'certificateUrl' => (string)($_POST['a_cert'] ?? ''),
      'media' => $media,
    ];
    $file = __DIR__ . '/data/achievements.json';
    ensure_subdir('data');
    if ($row['eventName'] && append_json_row($file, $row)) { $_SESSION['ok'] = 'Achievement added'; }
    else { $_SESSION['err'] = 'Could not update achievements.json'; }
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
  }
}

// Views
if (!is_authed()) {
  html_header('Admin Login');
  echo '<h2>Admin Login</h2>';
  if (!empty($_SESSION['err'])) { echo '<p style="color:#b00">' . htmlspecialchars($_SESSION['err']) . '</p>'; unset($_SESSION['err']); }
  echo '<form method="post"><input type="hidden" name="action" value="login" />'
     . '<label>Password</label><input type="password" name="password" required />'
     . '<button type="submit">Login</button></form>';
  echo '<p><small>Tip: same secret as <code>upload.php</code> token.</small></p>';
  html_footer();
  exit;
}

html_header('Admin');
echo '<nav><a href="?logout=1">Logout</a></nav>';
if (!empty($_SESSION['ok'])) { echo '<p style="color:#060">' . htmlspecialchars($_SESSION['ok']) . '</p>'; unset($_SESSION['ok']); }
if (!empty($_SESSION['err'])) { echo '<p style="color:#b00">' . htmlspecialchars($_SESSION['err']) . '</p>'; unset($_SESSION['err']); }

echo '<h2>1) Upload file (image / video / json)</h2>';
echo '<form method="post" enctype="multipart/form-data">'
   . '<input type="hidden" name="action" value="upload" />'
   . '<label>Subdir <small>e.g. <code>certificates</code> or <code>event-media/my-event-2025</code> or <code>data</code></small></label>'
   . '<input name="subdir" type="text" placeholder="certificates" />'
   . '<label>File</label><input name="file" type="file" accept="image/*,video/*,application/json" required />'
   . '<label>Save as (optional)</label><input name="name" type="text" placeholder="auto from file" />'
   . '<button type="submit">Upload</button>'
   . '</form>';

$lastSrc = isset($_SESSION['last_src']) ? (string)$_SESSION['last_src'] : '';

echo '<h2>2) Add certificate entry</h2>';
echo '<form method="post">'
   . '<input type="hidden" name="action" value="add_certificate" />'
   . '<label>src <small>e.g. <code>/certificates/cr36.jpg</code></small></label>'
   . '<input name="c_src" type="text" value="' . htmlspecialchars($lastSrc) . '" required />'
   . '<label>alt</label><input name="c_alt" type="text" />'
   . '<label>desc</label><input name="c_desc" type="text" />'
   . '<button type="submit">Append to certificates.json</button>'
   . '</form>';

echo '<h2>3) Add achievement entry</h2>';
echo '<form method="post">'
   . '<input type="hidden" name="action" value="add_achievement" />'
   . '<label>eventName</label><input name="a_event" type="text" required />'
   . '<label>date</label><input name="a_date" type="text" placeholder="May 2025" />'
   . '<label>outcome</label><input name="a_outcome" type="text" />'
   . '<label>description</label><textarea name="a_desc" rows="3"></textarea>'
   . '<label>techUsed</label><input name="a_tech" type="text" />'
   . '<label>certificateUrl <small>e.g. <code>/certificates/cr36.jpg</code></small></label>'
   . '<input name="a_cert" type="text" value="' . htmlspecialchars($lastSrc) . '" />'
   . '<label>media (comma separated URLs)</label><textarea name="a_media" rows="3" placeholder="/event-media/my-event/file1.jpg, /event-media/my-event/clip1.mp4"></textarea>'
   . '<button type="submit">Append to achievements.json</button>'
   . '</form>';

echo '<p><small>Note: The website already reads these JSON files at runtime, so changes appear on refresh. No redeploy needed.</small></p>';

html_footer();
?>


