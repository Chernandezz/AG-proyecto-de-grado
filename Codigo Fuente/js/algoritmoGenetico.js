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

  seleccionarPadre() {
    let padre = null;
    switch (this.tipoSeleccion) {
      case "ruleta":
        // mostrarPoblacion(this.poblacion);
        if (this.seDebeNormalizar()) this.normalizarPoblacion();
        // mostrarPoblacion(this.poblacion);
        padre = this.seleccionarPadreRuleta();
        break;
      case "universal":
        padre = this.seleccionarPadreUniversal();
        break;
      case "torneo":
        padre = this.seleccionarPadreTorneo();
        break;
      case "ranking":
        padre = this.seleccionarPadreRanking();
        break;
      case "restos":
        padre = this.seleccionarPadreRestos();
        break;
      case "estocastico":
        padre = this.seleccionarPadreEstocastico();
        break;
      default:
        padre = this.seleccionarPadreRuleta();
        break;
    }
    return padre;
  }

  seDebeNormalizar() {
    const minFitness = Math.min(
      ...this.poblacion.map((individuo) => individuo.fitness)
    );
    return minFitness < 0 ? true : false;
  }

  normalizarPoblacion() {
    // Encontrar el menor fitness de la población
    const minFitness = Math.min(
      ...this.poblacion.map((individuo) => individuo.fitness)
    );

    // Calcular el valor de fx para cada individuo
    this.poblacion = this.poblacion.map((individuo) => {
      individuo.fx = individuo.fitness - minFitness * 2;
      return individuo;
    });

    // Calcular la suma de los fx
    const fxTotal = this.poblacion.reduce(
      (total, individuo) => total + individuo.fx,
      0
    );

    let probabilidadAcumulada = 0;
    // Calcular la probabilidad de cada individuo
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      this.poblacion[i]["probabilidad"] = this.poblacion[i]["fx"] / fxTotal;
      // Calcular la probabilidad acumulada de cada individuo
      this.poblacion[i]["probabilidadAcumulada"] =
        probabilidadAcumulada + this.poblacion[i]["probabilidad"];
      probabilidadAcumulada = this.poblacion[i]["probabilidadAcumulada"];
    }
  }
}

function mostrarPoblacion(poblacion) {
  console.log("Población:");
  poblacion.forEach((individuo, index) => {
    console.log(
      `Individuo ${index + 1}: \n` +
        `Cromosoma: ${individuo.cromosoma.join("")}\n` +
        `Fitness: ${individuo.fitness.toFixed(4)}\n` +
        `Fx: ${individuo.fx}\n` +
        `Probabilidad: ${(individuo.probabilidad * 100).toFixed(2)}%\n` +
        `Probabilidad acumulada: ${(
          individuo.probabilidadAcumulada * 100
        ).toFixed(2)}%`
    );
  });
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

  const nuevaPoblacion = [];

  let cantidadHijos = algoritmo.tamanoPoblacion;
  if (algoritmo.elitismo) {
    const mejorIndividuo = algoritmo.poblacion.reduce((mejor, individuo) => {
      return individuo.fitness > mejor.fitness ? individuo : mejor;
    });
    nuevaPoblacion.push(mejorIndividuo);
    cantidadHijos--;
  }

  // Ciclo para llenar la nueva tabla
  for (let j = 0; j < cantidadHijos; j++) {
    const padre = algoritmo.seleccionarPadre();
    const madre = algoritmo.seleccionarMadre();

    const hijo = algoritmo.cruzar(padre, madre);
    const hijoMutado = algoritmo.mutar(hijo);

    nuevaPoblacion.push(hijoMutado);
  }

  algoritmo.poblacion = nuevaPoblacion;
}
