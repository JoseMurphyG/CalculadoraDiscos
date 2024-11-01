let chart; // Variable global para almacenar el gráfico 2D
let renderer3D; // Variable global para almacenar el renderizador 3D

document.getElementById("calcularBtn").addEventListener("click", function() {
    const funcion = document.getElementById("funcion").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);

    try {
        const resultado = calcularVolumen(funcion, a, b, 100);
        document.getElementById("resultado").innerText = "Resultado: " + resultado;

        // Llamada para mostrar ambas gráficas
        mostrarGrafica2D(funcion, a, b);
        mostrarGrafica3D(funcion, a, b);

    } catch (error) {
        document.getElementById("resultado").innerText = "Error en el cálculo: " + error.message;
    }
});

document.getElementById("limpiarBtn").addEventListener("click", function() {
    document.getElementById("funcion").value = "";
    document.getElementById("a").value = "0";
    document.getElementById("b").value = "1";
    document.getElementById("resultado").innerText = "Resultado: ";
    limpiarGraficas();
});

// Función para calcular el volumen usando el método de discos
function calcularVolumen(funcion, a, b, numIntervalos) {
    const dx = (b - a) / numIntervalos;
    let suma = 0;

    for (let i = 0; i < numIntervalos; i++) {
        const x = a + i * dx;
        const fX = evaluarFuncion(funcion, x);
        suma += Math.PI * fX * fX * dx; // Multiplicamos por π para calcular el volumen del disco
    }

    return suma;
}

// Función para evaluar la función
function evaluarFuncion(funcion, x) {
    return math.evaluate(funcion.replace(/x/g, `(${x})`));
}

// Función para mostrar la gráfica 2D
function mostrarGrafica2D(funcion, a, b) {
    const ctx = document.getElementById("grafico2D").getContext("2d");
    limpiarGraficas();

    const data = {
        labels: [],
        datasets: [{
            label: 'f(x)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
        }]
    };

    const numPuntos = 100;
    const dx = (b - a) / numPuntos;

    for (let i = 0; i <= numPuntos; i++) {
        const x = a + i * dx;
        const fX = evaluarFuncion(funcion, x);
        data.labels.push(x.toFixed(2)); // Redondeo para etiquetas
        data.datasets[0].data.push(fX);
    }

    // Crea el nuevo gráfico, destruyendo el anterior si ya existe
    if (chart) {
        chart.destroy(); // Destruir el gráfico anterior
    }
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)'
                    }
                }
            }
        }
    });
}

// Función para limpiar ambas gráficas (2D y 3D)
function limpiarGraficas() {
    if (chart) {
        chart.destroy(); // Destruir el gráfico 2D si existe
        chart = null; // Reiniciar la variable
    }

    // Limpiar la gráfica 3D si existe
    if (renderer3D) {
        renderer3D.dispose(); // Liberar recursos del renderizador 3D
        renderer3D.domElement.remove(); // Eliminar el elemento del DOM
        renderer3D = null; // Reiniciar la variable
    }
}

// Función para mostrar la gráfica 3D
function mostrarGrafica3D(funcion, a, b) {
    const contenedor3D = document.getElementById("contenedor3D");

    // Configuración de la escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, contenedor3D.clientWidth / contenedor3D.clientHeight, 0.1, 1000);
    renderer3D = new THREE.WebGLRenderer();
    renderer3D.setSize(contenedor3D.clientWidth, contenedor3D.clientHeight);
    contenedor3D.appendChild(renderer3D.domElement);

    // Material y color de la superficie
    const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });

    // Geometría de la rotación
    const points = [];
    const numPoints = 50;
    const dx = (b - a) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
        const x = a + i * dx;
        const y = evaluarFuncion(funcion, x);
        points.push(new THREE.Vector2(y, x)); // Coordenadas (radio, altura)
    }

    // Crear la geometría de revolución
    const geometry = new THREE.LatheGeometry(points, 30); // 30 segmentos para la revolución
    const lathe = new THREE.Mesh(geometry, material);
    scene.add(lathe);

    // Posicionar la cámara
    camera.position.z = 10;

    // Animación para rotación
    function animate() {
        requestAnimationFrame(animate);
        lathe.rotation.y += 0.01; // Rotación continua para visualización en 3D
        renderer3D.render(scene, camera);
    }
    animate();
}
