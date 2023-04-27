class AlgoritmoGenetico {
  constructor({
    expresionFuncionObjetivo,
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
    decimales,
  }) {
    this.expresionFuncionObjetivo = expresionFuncionObjetivo;
    this.tipoSeleccion = tipoSeleccion;
    this.tamanoPoblacion = tamanoPoblacion;
    this.tipoCruce = tipoCruce;
    this.tipoMutacion = tipoMutacion;
    this.probabilidadCruce = probabilidadCruce;
    this.probabilidadMutacion = probabilidadMutacion;
    this.numIteraciones = numIteraciones;
    this.xmin = xmin;
    this.xmax = xmax;
    this.n = decimales;
    this.Lind = Math.ceil(
      Math.log2((this.xmax - this.xmin) * Math.pow(10, this.n) + 1)
    );
    this.elitismo = elitismo;

    this.poblacion = this.generarPoblacionInicial();
  }

  // Implementar el resto de las funciones aquí.
  generarPoblacionInicial() {
    const poblacionInicial = [];

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      const individuo = {};

      const cromosoma = [];
      for (let k = 0; k < this.Lind; k++) {
        cromosoma.push(Math.random() < 0.5 ? 0 : 1);
      }
      individuo[`cromosoma`] = cromosoma;

      poblacionInicial.push(individuo);
    }

    return poblacionInicial;
  }
}

function crearFuncionObjetivo(expresion) {
  const mathExpression = math.compile(expresion);

  return function (cromosoma) {
    const variables = cromosoma.reduce((obj, gen, idx) => {
      obj["x" + (idx + 1)] = gen;
      return obj;
    }, {});

    return mathExpression.evaluate(variables);
  };
}

export function algoritmoGenetico(
  expresionFuncionObjetivo,
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
) {
  const funcionObjetivo = crearFuncionObjetivo(expresionFuncionObjetivo);

  const algoritmo = new AlgoritmoGenetico({
    expresionFuncionObjetivo,
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
    decimales,
  });

  console.log(algoritmo);

  // const resultados = algoritmo.ejecutar(funcionObjetivo);

  // // Conexiones con el DOM ==================
  // document.getElementById("resultados").innerHTML = `
  //   <h2>Resultados</h2>
  //   <p>Mejor individuo: ${resultados.mejorIndividuo}</p>
  //   <p>Valor de la función objetivo: ${resultados.mejorValor}</p>
  //   <p>Iteraciones: ${resultados.iteraciones}</p>
  //   <p>Tiempo: ${resultados.tiempo} ms</p>
  // `;
  // Fin conexiones con el DOM ==============
}
