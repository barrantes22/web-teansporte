<?php
header("Content-Type: application/json; charset=utf-8");

include "conexion.php";

$origen = $_GET['origen'] ?? '';
$destino = $_GET['destino'] ?? '';
$fecha = $_GET['fecha'] ?? '';

if (!$destino || !$fecha) {
    echo json_encode(["error" => "Faltan parámetros de búsqueda (destino o fecha)."]);
    exit;
}

$sql = "SELECT * FROM rutas WHERE origen LIKE ? AND destino LIKE ? AND fecha = ?";
$stmt = $conn->prepare($sql);

$searchOrigen = "%$origen%";
$searchDestino = "%$destino%";

$stmt->bind_param("sss", $searchOrigen, $searchDestino, $fecha);
$stmt->execute();

$result = $stmt->get_result();
$rutas = [];

while ($row = $result->fetch_assoc()) {
    $rutas[] = $row;
}

echo json_encode(["rutas" => $rutas], JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>
