document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const routesBody = document.getElementById('routes-body');
    const searchStatus = document.getElementById('search-status');

    // Datos simulados de rutas (RF-004)
    const availableRoutes = [
        { time: '08:00', company: 'Bolivariano', dest: 'Medellín', price: 90000, status: 'ontime' },
        { time: '10:30', company: 'Coomotor', dest: 'Cali', price: 75000, status: 'delayed' },
        { time: '14:00', company: 'Copetran', dest: 'Bucaramanga', price: 110000, status: 'ontime' },
        { time: '16:45', company: 'Expreso Palmira', dest: 'Cali', price: 70000, status: 'full' },
        { time: '20:00', company: 'Bolivariano', dest: 'Medellín', price: 95000, status: 'ontime' },
    ];

    /**
     * Función para simular la búsqueda y renderizar la tabla de resultados.
     */
    function renderRoutes(routes) {
        routesBody.innerHTML = '';
        
        if (routes.length === 0) {
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

            if (route.status === 'ontime') {
                statusText = 'A Tiempo';
                statusClass = 'ontime';
            } else if (route.status === 'delayed') {
                statusText = 'Retrasado';
                statusClass = 'delayed';
            } else if (route.status === 'full') {
                statusText = 'Agotado';
                statusClass = 'full';
                actionText = 'Verificar';
                actionDisabled = true;
            }

            // Crear celdas con etiquetas de datos para responsive
            row.innerHTML = `
                <td data-label="Hora Salida">${route.time}</td>
                <td data-label="Empresa">${route.company}</td>
                <td data-label="Destino">${route.dest}</td>
                <td data-label="Precio">$${route.price.toLocaleString('es-CO')}</td>
                <td data-label="Estado"><span class="status-tag ${statusClass}">${statusText}</span></td>
                <td data-label="Acción">
                    <button class="buy-button cta-button" 
                            data-route="${route.dest} ${route.time}"
                            ${actionDisabled ? 'disabled' : ''}>
                        ${actionText}
                    </button>
                </td>
            `;

            // Agregar evento al botón Comprar (simulación RF-003)
            const buyButton = row.querySelector('.buy-button');
            if (!actionDisabled) {
                buyButton.addEventListener('click', () => {
                    alert(`Simulación de compra: Seleccionaste la ruta a ${route.dest} de ${route.company} a las ${route.time}. Redireccionando al Checkout...`);
                    // Aquí iría la lógica de redirección a la selección de asiento (RF-002) y pago (RF-003)
                });
            }
        });
    }

    // Inicializar tabla vacía al cargar
    renderRoutes([]);

    // Manejar el envío del formulario (RF-001)
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const origen = document.getElementById('origen').value.trim();
        const destino = document.getElementById('destino').value.trim();
        const fecha = document.getElementById('fecha').value;

        searchStatus.textContent = 'Buscando rutas...';

        // Simulación: Filtrar rutas (Lógica de Búsqueda)
        const filteredRoutes = availableRoutes.filter(route => {
            // En un proyecto real, se verificaría origen y destino exactos con la DB
            // Aquí simulamos que el destino debe coincidir, e ignoramos el origen para la simulación
            return route.dest.toLowerCase().includes(destino.toLowerCase()) && 
                   fecha.length > 0; // Aseguramos que haya una fecha seleccionada
        });

        // Simulación de una pequeña latencia (RNF-Rendimiento)
        setTimeout(() => {
            renderRoutes(filteredRoutes);
        }, 500); 
    });
});