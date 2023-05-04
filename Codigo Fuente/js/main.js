import { algoritmoGenetico } from "./algoritmoGenetico.js";

document
  .getElementById("btnEjecutarAlgoritmo")
  .addEventListener("click", () => {
    ejecutarAlgoritmoGenetico();
  });

document.getElementById("nuevoAlgoritmo").addEventListener("click", () => {
  document.getElementById("resultados").classList.add("hidden");
  document.getElementById("formularioInicial").classList.remove("hidden");
});

function ejecutarAlgoritmoGenetico() {
  // Conexiones con el DOM ==================
  const expresionFuncionObjetivo =
    document.getElementById("funcion_objetivo").value;
  const tipoSeleccion = document.getElementById("tipo_seleccion").value;
  const tamanoPoblacion = parseInt(
    document.getElementById("tamano_poblacion").value
  );
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
  algoritmoGenetico(
    expresionFuncionObjetivo.toLowerCase(),
    tipoSeleccion,
    tamanoPoblacion,
    tipoCruce,
    tipoMutacion,
    probabilidadCruce,
    probabilidadMutacion,
    numIteraciones,
    xmin,
    xmax,
    elitismo,
    decimales
  );

  document.getElementById("formularioInicial").classList.add("hidden");
  document.getElementById("resultados").classList.remove("hidden");
}
