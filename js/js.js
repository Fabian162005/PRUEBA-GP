// Datos de votación
let votacion = {
    candidatos: [
        { id: 1, nombre: "Juan Pérez", partido: "Partido Democrático", votos: 0 },
        { id: 2, nombre: "María González", partido: "Partido Progresista", votos: 0 },
        { id: 3, nombre: "Carlos Rodríguez", partido: "Partido Liberal", votos: 0 }
    ],
    totalVotos: 0,
    votacionAbierta: true
};

// Configuración del gráfico
let ctx = document.getElementById('resultadosChart').getContext('2d');
let resultadosChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: votacion.candidatos.map(c => c.nombre),
        datasets: [{
            label: 'Votos',
            data: votacion.candidatos.map(c => c.votos),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

// Función para votar
function votar(candidatoId) {
    if (!votacion.votacionAbierta) {
        alert('La votación está cerrada');
        return;
    }

    // Verificar si ya votó (usando localStorage)
    if (localStorage.getItem('yaVoto')) {
        alert('Ya has emitido tu voto');
        return;
    }

    // Registrar voto
    const candidato = votacion.candidatos.find(c => c.id === candidatoId);
    if (candidato) {
        candidato.votos++;
        votacion.totalVotos++;
        localStorage.setItem('yaVoto', 'true');

        // Actualizar UI
        actualizarUI();
    }
}

// Función para actualizar la interfaz
function actualizarUI() {
    // Actualizar gráfico
    resultadosChart.data.datasets[0].data = votacion.candidatos.map(c => c.votos);
    resultadosChart.update();

    // Actualizar barras de progreso
    votacion.candidatos.forEach(candidato => {
        const porcentaje = (candidato.votos / votacion.totalVotos * 100) || 0;
        document.getElementById(`progress-${candidato.id}`).style.width = `${porcentaje}%`;
        document.getElementById(`progress-${candidato.id}`).setAttribute('aria-valuenow', porcentaje);
    });

    // Actualizar tabla de resultados
    const tabla = document.getElementById('resultadosTabla');
    tabla.innerHTML = '';
    votacion.candidatos.forEach(candidato => {
        const porcentaje = (candidato.votos / votacion.totalVotos * 100) || 0;
        tabla.innerHTML += `
            <tr>
                <td>${candidato.nombre}</td>
                <td>${candidato.votos}</td>
                <td>${porcentaje.toFixed(2)}%</td>
            </tr>
        `;
    });

    // Actualizar estadísticas
    document.getElementById('totalVotos').textContent = votacion.totalVotos;
    document.getElementById('participacion').textContent =
        `${((votacion.totalVotos / 1000) * 100).toFixed(1)}%`;
}

// Función para simular votos aleatorios
function simularVotosAleatorios() {
    if (!votacion.votacionAbierta) return;

    const intervalo = setInterval(() => {
        if (!votacion.votacionAbierta) {
            clearInterval(intervalo); // Detener el intervalo si la votación está cerrada
            return;
        }

        if (Math.random() > 0.7) { // 30% de probabilidad de voto
            const candidatoId = Math.floor(Math.random() * 3) + 1;
            const candidato = votacion.candidatos.find(c => c.id === candidatoId);
            if (candidato) {
                candidato.votos++;
                votacion.totalVotos++;
                actualizarUI();
            }
        }
    }, 2000);
}

// Contador regresivo
function iniciarContador() {
    const tiempoFinal = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 horas

    const contador = setInterval(() => {
        const ahora = new Date().getTime();
        const distancia = tiempoFinal - ahora;

        const horas = Math.floor(distancia / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        document.getElementById('timer').innerHTML =
            `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        document.getElementById('tiempoRestante').innerHTML =
            `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

        if (distancia < 0) {
            clearInterval(contador);
            votacion.votacionAbierta = false;
            document.getElementById('timer').innerHTML = "VOTACIÓN CERRADA";
            document.getElementById('tiempoRestante').innerHTML = "00:00";

            // Deshabilitar botones de votación
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.disabled = true;
                btn.textContent = 'Votación Cerrada';
            });
        }
    }, 1000);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    iniciarContador();
    actualizarUI();
    simularVotosAleatorios();
});