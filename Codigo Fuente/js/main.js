import { algoritmoGenetico } from "./algoritmoGenetico.js";
const tablaPadre = document.getElementById("tablas");

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
    ejecutarAlgoritmoGenetico();
  });

document.getElementById("nuevoAlgoritmo").addEventListener("click", () => {
  document.getElementById("resultados").classList.add("hidden");
  document.getElementById("formularioInicial").classList.remove("hidden");
  document.getElementById("grafico").classList.add("hidden");
});

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

function ejecutarAlgoritmoGenetico() {
  // Conexiones con el DOM ==================
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
  // Fin conexiones con el DOM ==============

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

  crearGraficoMejorIndividuo(res.mejoresCromosomas);

  tablaPadre.innerHTML = "";
  llenarTabla(
    "Tabla Inicial",
    res["tablaInicial"],
    res["fitnessInicial"].toFixed(2)
  );
  // Se llena la tabla con los resultados
  llenarTabla("Tabla Final", res["tablaFinal"], res["fitnessFinal"].toFixed(2));

  document.getElementById("formularioInicial").classList.add("hidden");
  document.getElementById("resultados").classList.remove("hidden");
}

let chart = null; // Variable global para guardar la referencia al gráfico

function crearGraficoMejorIndividuo(datos) {
  let ctx = document.getElementById("mejorIndividuoChart").getContext("2d");

  // Destruir el gráfico anterior si existe
  if (chart !== null) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Array.from({ length: datos.length }, (_, i) => i + 1),
      datasets: [
        {
          label: "Mejor Puntuación por Iteración",
          data: datos,
          borderColor: "#007bff",
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
            text: "Iteraciones",
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
}
