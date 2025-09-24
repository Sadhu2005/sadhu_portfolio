<?php
// PHP 5.6+ compatible admin panel with full MySQL support
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
  
  // Upload file (image/video/json) - for certificates, also store in SQL
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
      $filePath = '/' . ltrim(str_replace(__DIR__, '', $target), '/');
      $_SESSION['ok'] = 'Uploaded to ' . str_replace(__DIR__, '', $target);
      $_SESSION['last_src'] = $filePath;
      
      // If this is a certificate upload, also store in SQL
      if ($subdir === 'certificates' && $pdo) {
        try {
          $stmt = $pdo->prepare("INSERT INTO certificates (src, alt, `desc`, caption) VALUES (?, ?, ?, ?)");
          $stmt->execute(array($filePath, $name, '', ''));
          $_SESSION['ok'] .= ' and added to database';
        } catch (Exception $e) {
          $_SESSION['err'] = 'File uploaded but database error: ' . $e->getMessage();
        }
      }
    }
    header('Location: ' . $_SERVER['REQUEST_URI']);
    exit;
  }

  // MySQL-based operations
  if ($pdo) {
    // Add certificate to MySQL
    if ($act === 'add_certificate') {
      try {
        $stmt = $pdo->prepare("INSERT INTO certificates (src, alt, `desc`, caption) VALUES (?, ?, ?, ?)");
        $stmt->execute(array($_POST['c_src'], $_POST['c_alt'], $_POST['c_desc'], $_POST['c_caption']));
        $_SESSION['ok'] = 'Certificate added to database';
      } catch (Exception $e) {
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    // Add achievement to MySQL
    if ($act === 'add_achievement') {
      try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO achievements (eventName, `date`, outcome, description, techUsed, certificateUrl) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute(array($_POST['a_event'], $_POST['a_date'], $_POST['a_outcome'], $_POST['a_desc'], $_POST['a_tech'], $_POST['a_cert']));
        $achievement_id = $pdo->lastInsertId();
        
        // Add media
        $mediaRaw = (string)($_POST['a_media']);
        $media = array_values(array_filter(array_map('trim', explode(',', $mediaRaw)), function($v) { return $v !== ''; }));
        if (!empty($media)) {
          $stmt = $pdo->prepare("INSERT INTO achievement_media (achievement_id, url) VALUES (?, ?)");
          foreach ($media as $url) {
            $stmt->execute(array($achievement_id, $url));
          }
        }
        $pdo->commit();
        $_SESSION['ok'] = 'Achievement added to database';
      } catch (Exception $e) {
        $pdo->rollBack();
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    // Update certificate
    if ($act === 'update_certificate') {
      try {
        $stmt = $pdo->prepare("UPDATE certificates SET src=?, alt=?, `desc`=?, caption=? WHERE id=?");
        $stmt->execute(array($_POST['c_src'], $_POST['c_alt'], $_POST['c_desc'], $_POST['c_caption'], $_POST['c_id']));
        $_SESSION['ok'] = 'Certificate updated';
      } catch (Exception $e) {
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    // Update achievement
    if ($act === 'update_achievement') {
      try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("UPDATE achievements SET eventName=?, `date`=?, outcome=?, description=?, techUsed=?, certificateUrl=? WHERE id=?");
        $stmt->execute(array($_POST['a_event'], $_POST['a_date'], $_POST['a_outcome'], $_POST['a_desc'], $_POST['a_tech'], $_POST['a_cert'], $_POST['a_id']));
        
        // Update media
        $pdo->prepare("DELETE FROM achievement_media WHERE achievement_id=?")->execute(array($_POST['a_id']));
        $mediaRaw = (string)($_POST['a_media']);
        $media = array_values(array_filter(array_map('trim', explode(',', $mediaRaw)), function($v) { return $v !== ''; }));
        if (!empty($media)) {
          $stmt = $pdo->prepare("INSERT INTO achievement_media (achievement_id, url) VALUES (?, ?)");
          foreach ($media as $url) {
            $stmt->execute(array($_POST['a_id'], $url));
          }
        }
        $pdo->commit();
        $_SESSION['ok'] = 'Achievement updated';
      } catch (Exception $e) {
        $pdo->rollBack();
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    // Delete certificate
    if ($act === 'delete_certificate') {
      try {
        $stmt = $pdo->prepare("DELETE FROM certificates WHERE id=?");
        $stmt->execute(array($_POST['c_id']));
        $_SESSION['ok'] = 'Certificate deleted';
      } catch (Exception $e) {
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    // Delete achievement
    if ($act === 'delete_achievement') {
      try {
        $stmt = $pdo->prepare("DELETE FROM achievements WHERE id=?");
        $stmt->execute(array($_POST['a_id']));
        $_SESSION['ok'] = 'Achievement deleted';
      } catch (Exception $e) {
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    // Update intro video
    if ($act === 'update_intro_video') {
      try {
        $stmt = $pdo->query("SELECT id FROM intro_video LIMIT 1");
        $existing = $stmt->fetch();
        if ($existing) {
          $stmt = $pdo->prepare("UPDATE intro_video SET src=?, poster=? WHERE id=?");
          $stmt->execute(array($_POST['video_src'], $_POST['video_poster'], $existing['id']));
        } else {
          $stmt = $pdo->prepare("INSERT INTO intro_video (src, poster) VALUES (?, ?)");
          $stmt->execute(array($_POST['video_src'], $_POST['video_poster']));
        }
        $_SESSION['ok'] = 'Intro video updated';
      } catch (Exception $e) {
        $_SESSION['err'] = 'Database error: ' . $e->getMessage();
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }
  } else {
    // Fallback to JSON operations
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
        $_SESSION['ok'] = 'Certificate added to JSON (MySQL not configured)'; 
      } else { 
        $_SESSION['err'] = 'Could not update certificates.json'; 
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }

    if ($act === 'add_achievement') {
      $mediaRaw = (string)($_POST['a_media']);
      $media = array_values(array_filter(array_map('trim', explode(',', $mediaRaw)), function($v) { return $v !== ''; }));
      $row = array(
        'eventName' => (string)($_POST['a_event']),
        'date' => (string)($_POST['a_date']),
        'outcome' => (string)($_POST['a_outcome']),
        'description' => (string)($_POST['a_desc']),
        'techUsed' => (string)($_POST['a_tech']),
        'certificateUrl' => (string)($_POST['a_cert']),
        'media' => $media,
      );
      $file = __DIR__ . '/data/achievements.json';
      ensure_subdir('data');
      if ($row['eventName'] && append_json_row($file, $row)) { 
        $_SESSION['ok'] = 'Achievement added to JSON'; 
      } else { 
        $_SESSION['err'] = 'Could not update achievements.json'; 
      }
      header('Location: ' . $_SERVER['REQUEST_URI']);
      exit;
    }
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
   . '<label style="flex:1">Section<select name="type"><option value="cert"' . ($type==='cert'?' selected':'') . '>Certificates</option><option value="ach"' . ($type==='ach'?' selected':'') . '>Achievements</option></select></label>'
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

if ($type === 'ach') {
  echo '<h2>Achievements</h2>';
  if ($stage === 1) {
    echo '<h3>Stage 1: Upload certificate image or gallery file</h3>';
    echo '<form method="post" enctype="multipart/form-data">'
       . '<input type="hidden" name="action" value="upload" />'
       . '<label>Subdir <small>Use <code>certificates</code> for certificate image or <code>event-media/my-event-2025</code> for gallery</small></label>'
       . '<input name="subdir" type="text" placeholder="event-media/my-event-2025" />'
       . '<label>File</label><input name="file" type="file" accept="image/*,video/*" required />'
       . '<label>Save as (optional)</label><input name="name" type="text" placeholder="auto from file" />'
       . '<button type="submit">Upload</button>'
       . '</form>';
    if ($lastSrc) {
      echo '<p><small>Last upload: <code>' . htmlspecialchars($lastSrc) . '</code></small></p>';
      echo '<a class="button" href="?type=ach&stage=2" style="display:inline-block;padding:8px 12px;border:1px solid #ddd;border-radius:6px">Go to Stage 2</a>';
    }
  } elseif ($stage === 2) {
    echo '<h3>Stage 2: Add details and save</h3>';
    echo '<form method="post">'
       . '<input type="hidden" name="action" value="add_achievement" />'
       . '<label>eventName</label><input name="a_event" type="text" required />'
       . '<label>date</label><input name="a_date" type="text" placeholder="May 2025" />'
       . '<label>outcome</label><input name="a_outcome" type="text" />'
       . '<label>description</label><textarea name="a_desc" rows="3"></textarea>'
       . '<label>key skills (techUsed)</label><input name="a_tech" type="text" />'
       . '<label>certificateUrl</label><input name="a_cert" type="text" value="' . htmlspecialchars($lastSrc) . '" />'
       . '<label>media (comma separated URLs)</label><textarea name="a_media" rows="3" placeholder="/event-media/my-event/file1.jpg, /event-media/my-event/clip1.mp4"></textarea>'
       . '<button type="submit">Save achievement</button>'
       . '</form>';
    echo '<div style="margin-top:12px"><a href="?type=ach&stage=1" style="display:inline-block;padding:8px 12px;border:1px solid #ddd;border-radius:6px">Add more media or another achievement</a></div>';
  }
}

// Management sections (if MySQL is available)
if ($pdo) {
  echo '<h2>4) Manage existing entries</h2>';
  
  // Certificates management
  echo '<h3>Certificates</h3>';
  try {
    $stmt = $pdo->query("SELECT * FROM certificates ORDER BY created_at DESC");
    $certificates = $stmt->fetchAll();
    if ($certificates) {
      foreach ($certificates as $cert) {
        echo '<div style="border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:4px">';
        echo '<strong>' . htmlspecialchars($cert['alt']) . '</strong><br>';
        echo '<small>src: ' . htmlspecialchars($cert['src']) . '</small><br>';
        echo '<small>desc: ' . htmlspecialchars($cert['desc']) . '</small><br>';
        echo '<small>caption: ' . htmlspecialchars($cert['caption']) . '</small><br>';
        echo '<form method="post" style="display:inline;margin-right:8px">';
        echo '<input type="hidden" name="action" value="delete_certificate">';
        echo '<input type="hidden" name="c_id" value="' . $cert['id'] . '">';
        echo '<button type="submit" onclick="return confirm(\'Delete this certificate?\')" style="background:#b00;color:white;border:none;padding:4px 8px;border-radius:4px">Delete</button>';
        echo '</form>';
        echo '<button onclick="editCert(' . $cert['id'] . ', \'' . htmlspecialchars($cert['src']) . '\', \'' . htmlspecialchars($cert['alt']) . '\', \'' . htmlspecialchars($cert['desc']) . '\', \'' . htmlspecialchars($cert['caption']) . '\')" style="background:#006;color:white;border:none;padding:4px 8px;border-radius:4px">Edit</button>';
        echo '</div>';
      }
    } else {
      echo '<p><em>No certificates found</em></p>';
    }
  } catch (Exception $e) {
    echo '<p style="color:#b00">Error loading certificates: ' . htmlspecialchars($e->getMessage()) . '</p>';
  }

  // Achievements management
  echo '<h3>Achievements</h3>';
  try {
    $stmt = $pdo->query("
      SELECT a.*, 
             GROUP_CONCAT(am.url ORDER BY am.id) as media_urls
      FROM achievements a 
      LEFT JOIN achievement_media am ON a.id = am.achievement_id 
      GROUP BY a.id 
      ORDER BY a.created_at DESC
    ");
    $achievements = $stmt->fetchAll();
    if ($achievements) {
      foreach ($achievements as $ach) {
        echo '<div style="border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:4px">';
        echo '<strong>' . htmlspecialchars($ach['eventName']) . '</strong><br>';
        echo '<small>Date: ' . htmlspecialchars($ach['date']) . ' | Outcome: ' . htmlspecialchars($ach['outcome']) . '</small><br>';
        echo '<small>Tech: ' . htmlspecialchars($ach['techUsed']) . '</small><br>';
        echo '<form method="post" style="display:inline;margin-right:8px">';
        echo '<input type="hidden" name="action" value="delete_achievement">';
        echo '<input type="hidden" name="a_id" value="' . $ach['id'] . '">';
        echo '<button type="submit" onclick="return confirm(\'Delete this achievement?\')" style="background:#b00;color:white;border:none;padding:4px 8px;border-radius:4px">Delete</button>';
        echo '</form>';
        echo '<button onclick="editAchievement(' . $ach['id'] . ', \'' . htmlspecialchars($ach['eventName']) . '\', \'' . htmlspecialchars($ach['date']) . '\', \'' . htmlspecialchars($ach['outcome']) . '\', \'' . htmlspecialchars($ach['description']) . '\', \'' . htmlspecialchars($ach['techUsed']) . '\', \'' . htmlspecialchars($ach['certificateUrl']) . '\', \'' . htmlspecialchars($ach['media_urls']) . '\')" style="background:#006;color:white;border:none;padding:4px 8px;border-radius:4px">Edit</button>';
        echo '</div>';
      }
    } else {
      echo '<p><em>No achievements found</em></p>';
    }
  } catch (Exception $e) {
    echo '<p style="color:#b00">Error loading achievements: ' . htmlspecialchars($e->getMessage()) . '</p>';
  }

  // Intro video management
  echo '<h3>Intro Video</h3>';
  try {
    $stmt = $pdo->query("SELECT * FROM intro_video ORDER BY id DESC LIMIT 1");
    $video = $stmt->fetch();
    if ($video) {
      echo '<div style="border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:4px">';
      echo '<strong>Current video:</strong><br>';
      echo '<small>src: ' . htmlspecialchars($video['src']) . '</small><br>';
      echo '<small>poster: ' . htmlspecialchars($video['poster']) . '</small><br>';
      echo '<button onclick="editVideo(\'' . htmlspecialchars($video['src']) . '\', \'' . htmlspecialchars($video['poster']) . '\')" style="background:#006;color:white;border:none;padding:4px 8px;border-radius:4px">Edit</button>';
      echo '</div>';
    } else {
      echo '<p><em>No intro video set</em></p>';
    }
  } catch (Exception $e) {
    echo '<p style="color:#b00">Error loading intro video: ' . htmlspecialchars($e->getMessage()) . '</p>';
  }
}

// Simple management section (works with or without MySQL)
echo '<h2>4) View Current Data</h2>';

// Show current certificates from JSON
$certFile = __DIR__ . '/data/certificates.json';
if (file_exists($certFile)) {
  echo '<h3>Current Certificates (JSON)</h3>';
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

// Show current achievements from JSON
$achFile = __DIR__ . '/data/achievements.json';
if (file_exists($achFile)) {
  echo '<h3>Current Achievements (JSON)</h3>';
  $achData = json_decode(file_get_contents($achFile), true);
  if ($achData && is_array($achData)) {
    foreach ($achData as $index => $ach) {
      echo '<div style="border:1px solid #ddd;padding:8px;margin:8px 0;border-radius:4px">';
      echo '<strong>' . htmlspecialchars($ach['eventName']) . '</strong><br>';
      echo '<small>Date: ' . htmlspecialchars($ach['date']) . ' | Outcome: ' . htmlspecialchars($ach['outcome']) . '</small><br>';
      echo '<small>Tech: ' . htmlspecialchars($ach['techUsed']) . '</small><br>';
      echo '<small>Index: ' . $index . '</small>';
      echo '</div>';
    }
  } else {
    echo '<p><em>No achievements in JSON file</em></p>';
  }
} else {
  echo '<h3>Achievements</h3><p><em>No achievements.json file found</em></p>';
}

echo '<p><small>Note: The website reads from MySQL API first, then falls back to JSON files. Changes appear on refresh.</small></p>';

// JavaScript for edit forms
echo '<script>
function editCert(id, src, alt, desc, caption) {
  document.getElementById("edit-cert-form").style.display = "block";
  document.getElementById("edit-cert-id").value = id;
  document.getElementById("edit-cert-src").value = src;
  document.getElementById("edit-cert-alt").value = alt;
  document.getElementById("edit-cert-desc").value = desc;
  document.getElementById("edit-cert-caption").value = caption || "";
}

function editAchievement(id, event, date, outcome, desc, tech, cert, media) {
  document.getElementById("edit-ach-form").style.display = "block";
  document.getElementById("edit-ach-id").value = id;
  document.getElementById("edit-ach-event").value = event;
  document.getElementById("edit-ach-date").value = date;
  document.getElementById("edit-ach-outcome").value = outcome;
  document.getElementById("edit-ach-desc").value = desc;
  document.getElementById("edit-ach-tech").value = tech;
  document.getElementById("edit-ach-cert").value = cert;
  document.getElementById("edit-ach-media").value = media;
}

function editVideo(src, poster) {
  document.getElementById("edit-video-form").style.display = "block";
  document.getElementById("edit-video-src").value = src;
  document.getElementById("edit-video-poster").value = poster;
}
</script>';

// Edit forms (hidden by default)
if ($pdo) {
  echo '<div id="edit-cert-form" style="display:none;border:2px solid #006;padding:12px;margin:12px 0;border-radius:8px">';
  echo '<h4>Edit Certificate</h4>';
  echo '<form method="post">';
  echo '<input type="hidden" name="action" value="update_certificate">';
  echo '<input type="hidden" name="c_id" id="edit-cert-id">';
  echo '<label>src</label><input name="c_src" id="edit-cert-src" required>';
  echo '<label>alt</label><input name="c_alt" id="edit-cert-alt">';
  echo '<label>desc</label><input name="c_desc" id="edit-cert-desc">';
  echo '<label>caption</label><input name="c_caption" id="edit-cert-caption">';
  echo '<button type="submit">Update Certificate</button>';
  echo '<button type="button" onclick="document.getElementById(\'edit-cert-form\').style.display=\'none\'">Cancel</button>';
  echo '</form></div>';

  echo '<div id="edit-ach-form" style="display:none;border:2px solid #006;padding:12px;margin:12px 0;border-radius:8px">';
  echo '<h4>Edit Achievement</h4>';
  echo '<form method="post">';
  echo '<input type="hidden" name="action" value="update_achievement">';
  echo '<input type="hidden" name="a_id" id="edit-ach-id">';
  echo '<label>eventName</label><input name="a_event" id="edit-ach-event" required>';
  echo '<label>date</label><input name="a_date" id="edit-ach-date">';
  echo '<label>outcome</label><input name="a_outcome" id="edit-ach-outcome">';
  echo '<label>description</label><textarea name="a_desc" id="edit-ach-desc" rows="3"></textarea>';
  echo '<label>techUsed</label><input name="a_tech" id="edit-ach-tech">';
  echo '<label>certificateUrl</label><input name="a_cert" id="edit-ach-cert">';
  echo '<label>media (comma separated)</label><textarea name="a_media" id="edit-ach-media" rows="3"></textarea>';
  echo '<button type="submit">Update Achievement</button>';
  echo '<button type="button" onclick="document.getElementById(\'edit-ach-form\').style.display=\'none\'">Cancel</button>';
  echo '</form></div>';

  echo '<div id="edit-video-form" style="display:none;border:2px solid #006;padding:12px;margin:12px 0;border-radius:8px">';
  echo '<h4>Edit Intro Video</h4>';
  echo '<form method="post">';
  echo '<input type="hidden" name="action" value="update_intro_video">';
  echo '<label>src</label><input name="video_src" id="edit-video-src" required>';
  echo '<label>poster</label><input name="video_poster" id="edit-video-poster">';
  echo '<button type="submit">Update Video</button>';
  echo '<button type="button" onclick="document.getElementById(\'edit-video-form\').style.display=\'none\'">Cancel</button>';
  echo '</form></div>';
}

html_footer();
?>