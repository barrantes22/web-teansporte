document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const routesBody = document.getElementById('routes-body');
    const searchStatus = document.getElementById('search-status');

    // **NOTA:** Eliminamos los datos simulados (availableRoutes)

    /**
     * Función para simular la búsqueda y renderizar la tabla de resultados.
     * Ahora recibe directamente los datos del servidor.
     */
    function renderRoutes(routes) {
        routesBody.innerHTML = '';
        
        if (!routes || routes.length === 0) {
            searchStatus.textContent = 'No se encontraron rutas para los criterios especificados.';
            return;
        }

        searchStatus.textContent = `Se encontraron ${routes.length} salidas disponibles:`;

        routes.forEach(route => {
            const row = routesBody.insertRow();
            
            // Lógica para etiquetas de estado (RNF-Usabilidad, Especificaciones Visuales)
            let statusText = '';
            let statusClass = '';
            let actionText = 'Comprar';
            let actionDisabled = false;

            // La columna del estado en la DB es 'estado', y la hora es 'hora_salida'
            if (route.estado === 'ontime') {
                statusText = 'A Tiempo';
                statusClass = 'ontime';
            } else if (route.estado === 'delayed') {
                statusText = 'Retrasado';
                statusClass = 'delayed';
            } else if (route.estado === 'full') {
                statusText = 'Agotado';
                statusClass = 'full';
                actionText = 'Verificar';
                actionDisabled = true;
            }

            // Usar 'route.hora_salida' (de la DB) y 'route.precio' (de la DB)
            row.innerHTML = `
                <td data-label="Hora Salida">${route.hora_salida.substring(0, 5)}</td> <td data-label="Empresa">${route.empresa}</td>
                <td data-label="Destino">${route.destino}</td>
                <td data-label="Precio">$${parseInt(route.precio).toLocaleString('es-CO')}</td>
                <td data-label="Estado"><span class="status-tag ${statusClass}">${statusText}</span></td>
                <td data-label="Acción">
                    <button class="buy-button cta-button" 
                            data-route="${route.destino} ${route.hora_salida}"
                            ${actionDisabled ? 'disabled' : ''}>
                        ${actionText}
                    </button>
                </td>
            `;

            // Agregar evento al botón Comprar (simulación RF-003)
            const buyButton = row.querySelector('.buy-button');
            if (!actionDisabled) {
                buyButton.addEventListener('click', () => {
                    alert(`Simulación de compra: Seleccionaste la ruta a ${route.destino} de ${route.empresa} a las ${route.hora_salida}. Redireccionando al Checkout...`);
                    // Aquí iría la lógica de redirección a la selección de asiento (RF-002) y pago (RF-003)
                });
            }
        });
    }

    // Inicializar tabla vacía al cargar
    renderRoutes([]);

    // Manejar el envío del formulario (RF-001) - **MODIFICADO**
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const origen = document.getElementById('origen').value.trim();
        const destino = document.getElementById('destino').value.trim();
        const fecha = document.getElementById('fecha').value;

        if (!destino || !fecha) {
            alert('Por favor, ingresa un Destino y una Fecha.');
            return;
        }

        searchStatus.textContent = 'Buscando rutas...';
        routesBody.innerHTML = ''; // Limpiar resultados anteriores

        // Crear los parámetros de la URL para enviar al script PHP
        const params = new URLSearchParams({
            origen: origen,
            destino: destino,
            fecha: fecha
        });
        
        // Uso de fetch para realizar la petición al backend (RNF-Rendimiento)
        try {
            // Se usa el keyword 'await' por eso la función debe ser 'async'
            const response = await fetch(`buscar_rutas.php?${params.toString()}`);
            const data = await response.json();

            if (data.error) {
                searchStatus.textContent = `Error: ${data.error}`;
                console.error('Error del servidor:', data.error);
                return;
            }

            // Llamar a renderRoutes con los datos obtenidos de la base de datos
            renderRoutes(data.rutas);

        } catch (error) {
            searchStatus.textContent = 'Ocurrió un error al conectar con el servidor de rutas.';
            console.error('Error de fetch:', error);
        }
    });
});