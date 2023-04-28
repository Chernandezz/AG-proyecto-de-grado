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
    this.expresionFuncionObjetivo = crearFuncionObjetivo(
      expresionFuncionObjetivo
    );
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
      Math.log2(1 + (this.xmax - this.xmin) * Math.pow(10, this.n))
    );
    this.elitismo = elitismo;

    this.poblacion = this.generarPoblacionInicial();
  }

  // Implementar el resto de las funciones aquí.
  generarPoblacionInicial() {
    const poblacionInicial = [];
    let fxTotal = 0;

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      const individuo = {};

      const cromosoma = [];
      for (let k = 0; k < this.Lind; k++) {
        cromosoma.push(Math.random() < 0.5 ? 0 : 1);
      }
      individuo[`cromosoma`] = cromosoma;
      individuo["binario"] = cromosoma.join("");

      // Calcular los valores de xi

      const xi =
        this.xmin +
        (parseInt(individuo["binario"], 2) * (this.xmax - this.xmin)) /
          (Math.pow(2, this.Lind) - 1);
      console.log(xi);
      // Calcular el valor de fitness usando los valores de xi
      individuo["fitness"] = this.expresionFuncionObjetivo({ x: xi });

      fxTotal += individuo["fitness"];

      poblacionInicial.push(individuo);
    }

    let probabilidadAcumulada = 0;
    // Calcular la probabilidad de cada individuo
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      poblacionInicial[i]["probabilidad"] =
        poblacionInicial[i]["fitness"] / fxTotal;
      // Calcular la probabilidad acumulada de cada individuo
      poblacionInicial[i]["probabilidadAcumulada"] =
        probabilidadAcumulada + poblacionInicial[i]["probabilidad"];
      probabilidadAcumulada = poblacionInicial[i]["probabilidadAcumulada"];
    }

    return poblacionInicial;
  }
}

function crearFuncionObjetivo(expresion) {
  const mathExpression = math.compile(expresion);

  return function (variables) {
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
}
