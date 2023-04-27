// Algoritmo genético en JavaScript
// Para el formulario HTML proporcionado

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");
  const resultados = document.getElementById("resultados");
  const respuesta = document.getElementById("respuesta");
  const nuevoAlgoritmo = document.getElementById("nuevoAlgoritmo");

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const funcionObjetivo = document.getElementById("funcion_objetivo").value;
    const tipoSeleccion = document.getElementById("tipo_seleccion").value;
    const tamanoPoblacion = parseInt(
      document.getElementById("tamano_poblacion").value
    );
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

    // Ejecute el algoritmo genético aquí
    // Utilice las variables de configuración anteriores y su implementación de algoritmo genético
    // Al final, muestre los resultados en la sección "respuesta"

    respuesta.innerHTML = "Resultados del algoritmo genético...";
    resultados.classList.remove("hidden");
  });

  nuevoAlgoritmo.addEventListener("click", function () {
    resultados.classList.add("hidden");
  });
});
