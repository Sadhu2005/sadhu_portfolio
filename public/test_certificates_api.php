<?php
// Test certificates API endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'message' => 'Certificates API is working',
    'timestamp' => date('Y-m-d H:i:s'),
    'path' => __FILE__,
    'base_path' => $_SERVER['REQUEST_URI']
]);
?>
