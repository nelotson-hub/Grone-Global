<?php
// Newsletter signup: saves the email to data/subscribers.csv (the folder is blocked from the web by data/.htaccess).
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
if (!$email) { http_response_code(422); echo '{"ok":false,"error":"invalid email"}'; exit; }
$file = __DIR__ . '/data/subscribers.csv';
$existing = is_file($file) ? file($file, FILE_IGNORE_NEW_LINES) : [];
foreach ($existing as $line) { if (strcasecmp(explode(',', $line)[0], $email) === 0) { echo '{"ok":true}'; exit; } }
$fh = fopen($file, 'a');
if (!$fh) { http_response_code(500); echo '{"ok":false}'; exit; }
flock($fh, LOCK_EX); fputcsv($fh, [$email, date('c')]); flock($fh, LOCK_UN); fclose($fh);
echo '{"ok":true}';
