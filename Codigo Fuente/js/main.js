import { algoritmoGenetico } from "./algoritmoGenetico.js";
const tablaPadre = document.getElementById("tablas");

let queue = []; // Cola de trabajos a ejecutar
let colores = ["#007bff", "#dc3545", "#ffc107", "#17a2b8", "#28a745"]; // Array de colores para los gráficos
let chart = null; // Variable global para guardar la referencia al gráfico

document.getElementById("btnVerGraficas").addEventListener("click", () => {
  document.getElementById("grafico").classList.remove("hidden");
  document.getElementById("resultados").classList.add("hidden");
  document.getElementById("formularioInicial").classList.add("hidden");
});

document.getElementById("btnVerTablas").addEventListener("click", () => {
  document.getElementById("grafico").classList.add("hidden");
  document.getElementById("resultados").classList.remove("hidden");
  document.getElementById("formularioInicial").classList.add("hidden");
});

document
  .getElementById("btnEjecutarAlgoritmo")
  .addEventListener("click", () => {
    document.getElementById("formularioInicial").classList.add("hidden");
    document.getElementById("resultados").classList.remove("hidden");
  });

document.getElementById("nuevoAlgoritmo").addEventListener("click", () => {
  document.getElementById("resultados").classList.add("hidden");
  document.getElementById("formularioInicial").classList.remove("hidden");
  document.getElementById("grafico").classList.add("hidden");

  // Limpieza de las tablas
  tablaPadre.innerHTML = "";

  // Reiniciar gráficos
  if (chart !== null) {
    chart.destroy();
    chart = null;
  }
});

document
  .getElementById("btnAgregarAlgoritmo")
  .addEventListener("click", function () {
    const titulo = document.getElementById("titulo_ejecucion").value;
    if (!titulo) {
      alert("Por favor, ingresa un título para la ejecución");
      return;
    }
    ejecutarAlgoritmoGenetico(titulo);
    alert(
      'Algoritmo "' + titulo + '" agregado con éxito a la cola de ejecución.'
    );
  });

function ejecutarAlgoritmoGenetico(titulo) {
  // Conexiones con el DOM
  const expresionFuncionObjetivo =
    document.getElementById("funcion_objetivo").value;
  const tipoSeleccion = document.getElementById("tipo_seleccion").value;
  const tamanoPoblacion = parseInt(
    document.getElementById("tamano_poblacion").value
  );
  const convergencia = document.getElementById("convergencia").checked;
  const decimales = parseInt(document.getElementById("decimales").value);
  const tipoCruce = document.getElementById("tipo_cruce").value;
  const tipoMutacion = document.getElementById("tipo_mutacion").value;
  const probabilidadCruce = parseFloat(
    document.getElementById("probabilidad_cruce").value
  );
  const probabilidadMutacion = parseFloat(
    document.getElementById("probabilidad_mutacion").value
  );
  const numIteraciones = parseInt(
    document.getElementById("num_iteraciones").value
  );
  const xmin = parseFloat(document.getElementById("xmin").value);
  const xmax = parseFloat(document.getElementById("xmax").value);
  const elitismo = document.getElementById("elitismo").checked;

  let colaAg = []; // Cola de AGs
  // Se trae la funcion objetivo ya normalizada
  let res = algoritmoGenetico(
    expresionFuncionObjetivo.toLowerCase(),
    tipoSeleccion,
    tamanoPoblacion,
    tipoCruce,
    tipoMutacion,
    probabilidadCruce,
    probabilidadMutacion,
    numIteraciones,
    convergencia,
    xmin,
    xmax,
    elitismo,
    decimales
  );

  // Se agrega el resultado a la cola de AGs
  colaAg.push(res);

  crearGraficoMejorIndividuo(res.mejoresCromosomas, titulo);

  llenarTabla(
    `Tabla Inicial - ${titulo}`,
    res["tablaInicial"],
    res["fitnessInicial"].toFixed(2)
  );

  llenarTabla(
    `Tabla Final - ${titulo}`,
    res["tablaFinal"],
    res["fitnessFinal"].toFixed(2)
  );
}

function llenarTabla(nomTabla, datos, fitness) {
  const divTabla = document.createElement("div");
  divTabla.classList.add("divTabla");
  divTabla.classList.add("container");
  const titulo = document.createElement("h2");
  titulo.innerHTML = nomTabla;
  titulo.classList.add("tituloTabla");
  const fitnessTabla = document.createElement("h3");
  fitnessTabla.innerHTML = `Fitness: ${fitness}`;
  fitnessTabla.classList.add("fitnessTabla");
  const tabla = document.createElement("table");
  tabla.classList.add("tabla");

  tabla.innerHTML = `<tr>
          <th>Cromosoma</th>
          <th>Binario</th>
          <th>Xi</th>
          <th>Fitness</th>
          <th>Probabilidad</th>
          <th>Prob. Acumulada</th>
        </tr>`;

  for (let i = 0; i < datos.length; i++) {
    let row = `<tr>
                            <td>${datos[i].cromosoma.join()}</td>
                            <td>${datos[i].binario}</td>
                            <td>${datos[i].xi}</td>
                            <td>${datos[i].fitness}</td>
                            <td>${datos[i].probabilidad}</td>
                            <td>${datos[i].probabilidadAcumulada}</td>
                      </tr>`;
    tabla.innerHTML += row;
  }
  divTabla.appendChild(titulo);
  divTabla.appendChild(fitnessTabla);
  divTabla.appendChild(tabla);
  tablaPadre.appendChild(divTabla);
}

function crearGraficoMejorIndividuo(datos, titulo) {
  let ctx = document.getElementById("mejorIndividuoChart").getContext("2d");
  let color =
    colores[chart === null ? 0 : chart.data.datasets.length % colores.length];

  let divisionFactor = Math.ceil(datos.length / 100);

  // Reducir los datos a cada 'divisionFactor' puntos
  let datosReducidos = datos.filter((_, i) => i % divisionFactor === 0);

  if (chart === null) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: datosReducidos.map((_, i) => (i + 1) * divisionFactor),
        datasets: [
          {
            label: titulo,
            data: datosReducidos,
            borderColor: color,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Iteracion",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Mejor puntuación",
            },
            beginAtZero: true,
          },
        },
      },
    });
  } else {
    chart.data.datasets.push({
      label: titulo,
      data: datosReducidos,
      borderColor: color,
      fill: false,
    });
    chart.update();
  }
}

// cambiar el grafico de puntos a lineas, y hacer que el salto de punto a punto sea de el numero de iteraciones/100
