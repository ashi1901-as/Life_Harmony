<?php
// backend/add_to_cart.php - Add item to cart
header("Access-Control-Allow-Origin: http://127.0.0.1:5500"); // Or http://localhost:8000
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once 'config.php';
session_start();

// Temporarily force session user_id for testing
$_SESSION['user_id'] = 1; // Use a known user id

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'];
    $productId = $_POST['productId'];
    $quantity = $_POST['quantity'];

    try {
        $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (:userId, :productId, :quantity)");
        $stmt->bindParam(':userId', $userId);
        $stmt->bindParam(':productId', $productId);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->execute();

        echo json_encode(['success' => true, 'message' => 'Item added to cart']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to add to cart: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>