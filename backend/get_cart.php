<?php
// backend/get_cart.php - Get cart items
header("Access-Control-Allow-Origin: http://127.0.0.1:5500"); // Or localhost:8000
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once 'config.php';

if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    try {
        $stmt = $conn->prepare("SELECT products.*, cart.quantity FROM cart INNER JOIN products ON cart.product_id = products.id WHERE cart.user_id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $totalAmount = 0;
        foreach ($cartItems as $item) {
            $totalAmount += ($item['price'] * $item['quantity']);
        }

        echo json_encode(['success' => true, 'cartItems' => $cartItems, 'totalAmount' => $totalAmount]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve cart: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
}
?>