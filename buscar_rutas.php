<?php
// Configuración de la conexión a la base de datos
$host = 'localhost';
$dbname = 'terminal_db';
$user = 'localhost';
$password = '20211106';

header('Content-Type: application/json');

// 1. Obtener parámetros de búsqueda (RF-001)
$origen = isset($_GET['origen']) ? $_GET['origen'] : '';
$destino = isset($_GET['destino']) ? $_GET['destino'] : '';
$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : '';

// Verificar que al menos el destino esté presente para la búsqueda
if (empty($destino)) {
    echo json_encode(['error' => 'Se requiere el destino para la búsqueda.']);
    exit;
}

try {
    // 2. Conexión a la base de datos usando PDO (Práctica recomendada)
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 3. Preparar la consulta SQL (RF-004)
    // Usamos LIKE para búsquedas parciales o WHERE exacto si se requieren coincidencias perfectas.
    $sql = "SELECT hora_salida, empresa, destino, precio, estado 
            FROM rutas 
            WHERE destino LIKE :destino";

    // Opcional: Agregar el origen si también se envía
    if (!empty($origen)) {
        $sql .= " AND origen LIKE :origen";
    }

    $stmt = $pdo->prepare($sql);
    
    // 4. Asignar los valores y ejecutar la consulta
    $stmt->bindValue(':destino', '%' . $destino . '%');

    if (!empty($origen)) {
        $stmt->bindValue(':origen', '%' . $origen . '%');
    }

    $stmt->execute();
    $rutas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Devolver los resultados en formato JSON
    echo json_encode(['success' => true, 'rutas' => $rutas]);

} catch (PDOException $e) {
    // Manejo de errores
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
}

?>