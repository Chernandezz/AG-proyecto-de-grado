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
        if (this.seDebeNormalizar()) this.normalizarPoblacion();
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

  seleccionarPadreRuleta() {
    const r = Math.random();
    for (const individuo of this.poblacion) {
      if (r <= individuo.probabilidadAcumulada) {
        return individuo;
      }
    }
    return this.poblacion[this.tamanoPoblacion - 1];
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

  // Inicio Seccion de Cruces
  cruzar(padre1, padre2) {
    let hijos;
    switch (this.tipoCruce) {
      case "unPunto":
        hijos = this.cruzarUnPunto(padre1, padre2);
        break;
      case "dosPuntos":
        hijos = this.cruzarDosPuntos(padre1, padre2);
        break;
      case "uniforme":
        hijos = this.cruzarUniforme(padre1, padre2);
        break;
      default:
        hijos = this.cruzarUnPunto(padre1, padre2);
        break;
    }
    return hijos;
  }

  cruzarUnPunto(padre1, padre2) {
    const puntoCruce = Math.floor(Math.random() * this.Lind);
    const hijo1 = {
      cromosoma: [],
    };
    const hijo2 = {
      cromosoma: [],
    };

    hijo1.cromosoma = hijo1.cromosoma.concat(
      padre1.cromosoma.slice(0, puntoCruce)
    );
    hijo1.cromosoma = hijo1.cromosoma.concat(
      padre2.cromosoma.slice(puntoCruce)
    );

    hijo2.cromosoma = hijo2.cromosoma.concat(
      padre2.cromosoma.slice(0, puntoCruce)
    );
    hijo2.cromosoma = hijo2.cromosoma.concat(
      padre1.cromosoma.slice(puntoCruce)
    );

    return [hijo1, hijo2];
  }

  // cruzarDosPuntos(padre1, padre2) {
  //   let puntoCruce1 = Math.floor(Math.random() * this.Lind);
  //   let puntoCruce2 = Math.floor(Math.random() * this.Lind);

  //   while (puntoCruce1 === puntoCruce2) {
  //     puntoCruce2 = Math.floor(Math.random() * this.Lind);
  //   }

  //   if (puntoCruce1 > puntoCruce2) {
  //     [puntoCruce1, puntoCruce2] = [puntoCruce2, puntoCruce1];
  //   }

  //   const hijo1 = {
  //     cromosoma: [],
  //   };
  //   const hijo2 = {
  //     cromosoma: [],
  //   };

  //   for (let i = 0; i < this.Lind; i++) {
  //     if (i < puntoCruce1 || i > puntoCruce2) {
  //       hijo1.cromosoma.push(padre1.cromosoma[i]);
  //       hijo2.cromosoma.push(padre2.cromosoma[i]);
  //     } else {
  //       hijo1.cromosoma.push(padre2.cromosoma[i]);
  //       hijo2.cromosoma.push(padre1.cromosoma[i]);
  //     }
  //   }

  //   return [hijo1, hijo2];
  // }

  // cruzarUniforme(padre1, padre2) {
  //   const hijo1 = {
  //     cromosoma: [],
  //   };
  //   const hijo2 = {
  //     cromosoma: [],
  //   };

  //   for (let i = 0; i < this.Lind; i++) {
  //     if (Math.random() < 0.5) {
  //       hijo1.cromosoma.push(padre1.cromosoma[i]);
  //       hijo2.cromosoma.push(padre2.cromosoma[i]);
  //     } else {
  //       hijo1.cromosoma.push(padre2.cromosoma[i]);
  //       hijo2.cromosoma.push(padre1.cromosoma[i]);
  //     }
  //   }

  //   return [hijo1, hijo2];
  // }

  // Fin Seccion de Cruces

  // Inicio Seccion de Mutaciones
  mutar(individuo) {
    switch (this.tipoMutacion) {
      case "bit_flip":
        individuo = this.mutarBitflip(individuo);
        break;
      case "intercambio":
        individuo = this.mutarIntercambio(individuo);
        break;
      default:
        individuo = this.mutarBitflip(individuo);
        break;
    }
    return individuo;
  }

  // Método de mutación bitflip
  // Método de mutación bitflip
  mutarBitflip(individuo) {
    // Crear una copia del objeto individuo antes de modificarlo
    const individuoMutado = JSON.parse(JSON.stringify(individuo));

    for (let i = 0; i < this.Lind; i++) {
      if (Math.random() < this.probabilidadMutacion) {
        individuoMutado.cromosoma[i] =
          individuoMutado.cromosoma[i] === 0 ? 1 : 0;
      }
    }
    return individuoMutado;
  }

  // Método de mutación intercambio
  mutarIntercambio(individuo) {
    const pos1 = Math.floor(Math.random() * this.Lind);
    let pos2 = Math.floor(Math.random() * this.Lind);

    while (pos1 === pos2) {
      pos2 = Math.floor(Math.random() * this.Lind);
    }

    if (Math.random() < this.probabilidadMutacion) {
      [individuo.cromosoma[pos1], individuo.cromosoma[pos2]] = [
        individuo.cromosoma[pos2],
        individuo.cromosoma[pos1],
      ];
    }
  }

  // Fin Seccion de Mutaciones

  // Actualizar la población
  actualizarPoblacion(nuevaPoblacion) {
    this.poblacion = nuevaPoblacion;
    let fxTotal = 0;

    for (const individuo of this.poblacion) {
      individuo["binario"] = individuo.cromosoma.join("");

      const xi =
        this.xmin +
        (parseInt(individuo["binario"], 2) * (this.xmax - this.xmin)) /
          (Math.pow(2, this.Lind) - 1);
      individuo["fitness"] = this.expresionFuncionObjetivo({ x: xi });

      fxTotal += individuo["fitness"];
    }

    let probabilidadAcumulada = 0;
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      this.poblacion[i]["probabilidad"] =
        this.poblacion[i]["fitness"] / fxTotal;
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

function calculoTotalFitness(poblacion) {
  let totalFitness = 0;
  poblacion.forEach((individuo) => {
    totalFitness += individuo.fitness;
  });
  return totalFitness;
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
    const padre1 = algoritmo.seleccionarPadre();
    const padre2 = algoritmo.seleccionarPadre();
    const [hijo1, hijo2] = algoritmo.cruzar(padre1, padre2);
    const hijo1Mutado = algoritmo.mutar(hijo1);
    const hijo2Mutado = algoritmo.mutar(hijo2);
    nuevaPoblacion.push(hijo1Mutado);
    nuevaPoblacion.push(hijo2Mutado);
  }
  console.log("totalFitnes Pob:", calculoTotalFitness(algoritmo.poblacion));
  algoritmo.actualizarPoblacion(nuevaPoblacion);
  console.log("totalFitnes Pob:", calculoTotalFitness(algoritmo.poblacion));
}
