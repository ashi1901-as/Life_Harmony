<?php
// backend/config.php - Database configuration
$servername = "127.0.0.1";
$username = "ashi";
$password = "password";
$dbname = "ecommerce";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Remove or comment out the following line in production:
    // echo "Connection successful";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}
?>