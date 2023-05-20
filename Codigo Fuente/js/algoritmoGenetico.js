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
    convergencia,
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
    this.convergencia = convergencia;
    this.Lind = Math.ceil(
      Math.log2(1 + (this.xmax - this.xmin) * Math.pow(10, this.n))
    );
    this.elitismo = elitismo;

    this.poblacion = this.generarPoblacionInicial();
    this.actualizarProbabilidades(this.poblacion);

    if (this.tipoSeleccion === "ruleta" && this.seDebeNormalizar()) {
      this.normalizarPoblacion();
    }
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
      individuo["xi"] = xi;
      // Calcular el valor de fitness usando los valores de xi
      individuo["fitness"] = this.expresionFuncionObjetivo({ x: xi });

      fxTotal += individuo["fitness"];

      poblacionInicial.push(individuo);
    }

    this.actualizarProbabilidades(poblacionInicial);

    return poblacionInicial;
  }

  actualizarProbabilidades(poblacion) {
    let probabilidadAcumulada = 0;
    let fxTotal = poblacion.reduce(
      (total, individuo) => total + individuo["fitness"],
      0
    );

    for (let i = 0; i < this.tamanoPoblacion; i++) {
      poblacion[i]["probabilidad"] = poblacion[i]["fitness"] / fxTotal;
      poblacion[i]["probabilidadAcumulada"] =
        probabilidadAcumulada + poblacion[i]["probabilidad"];
      probabilidadAcumulada = poblacion[i]["probabilidadAcumulada"];
    }
  }

  seleccionarPadre() {
    let padre = null;
    switch (this.tipoSeleccion) {
      case "ruleta":
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
    const padre = {};
    for (const individuo of this.poblacion) {
      if (r <= individuo.probabilidadAcumulada) {
        padre.cromosoma = [...individuo.cromosoma]; // Copiar el cromosoma en lugar de asignarlo directamente
        break;
      }
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

  // Inicio Seccion de Cruces
  cruzar(padre1, padre2) {
    let hijos;
    if (Math.random() > this.probabilidadCruce) {
      return [padre1, padre2];
    }
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
    let fxTotal = 0;

    for (const individuo of nuevaPoblacion) {
      individuo["binario"] = individuo.cromosoma.join("");

      const xi =
        this.xmin +
        (parseInt(individuo["binario"], 2) * (this.xmax - this.xmin)) /
          (Math.pow(2, this.Lind) - 1);
      individuo["xi"] = xi;
      // Calcular el valor de fitness usando los valores de xi
      individuo["fitness"] = this.expresionFuncionObjetivo({ x: xi });

      fxTotal += individuo["fitness"];
    }

    let probabilidadAcumulada = 0;
    // Calcular la probabilidad de cada individuo
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      nuevaPoblacion[i]["probabilidad"] =
        nuevaPoblacion[i]["fitness"] / fxTotal;
      // Calcular la probabilidad acumulada de cada individuo
      nuevaPoblacion[i]["probabilidadAcumulada"] =
        probabilidadAcumulada + nuevaPoblacion[i]["probabilidad"];
      probabilidadAcumulada = nuevaPoblacion[i]["probabilidadAcumulada"];
    }
    this.poblacion = [...nuevaPoblacion];
  }

  calculoFitnessTotal() {
    let fxTotal = 0;
    for (const individuo of this.poblacion) {
      fxTotal += individuo["fitness"];
    }
    return fxTotal;
  }

  verificarConvergencia() {
    const fitnessInicial = this.poblacion[0].fitness;
    for (let i = 1; i < this.tamanoPoblacion; i++) {
      if (this.poblacion[i].fitness !== fitnessInicial) {
        return false;
      }
    }
    return true;
  }

  limitarDecimales() {
    let copiaPoblacion = JSON.parse(JSON.stringify(this.poblacion));
    for (let i = 0; i < this.tamanoPoblacion; i++) {
      copiaPoblacion[i].xi = parseFloat(copiaPoblacion[i].xi.toFixed(2));
      copiaPoblacion[i].fitness = parseFloat(
        copiaPoblacion[i].fitness.toFixed(2)
      );
      copiaPoblacion[i].probabilidad = parseFloat(
        copiaPoblacion[i].probabilidad.toFixed(2)
      );
      copiaPoblacion[i].probabilidadAcumulada = parseFloat(
        copiaPoblacion[i].probabilidadAcumulada.toFixed(2)
      );
    }
    return copiaPoblacion;
  }

  ejecutar() {
    let tablaInicial = this.limitarDecimales();
    let fitnessInicial = this.calculoFitnessTotal();
    let mejoresCromosomas = [];
    for (let i = 0; i < this.numIteraciones; i++) {
      const nuevaPoblacion = [];
      let cantidadHijos = this.tamanoPoblacion;

      if (this.elitismo) {
        const mejorIndividuo = this.poblacion.reduce((mejor, individuo) => {
          return individuo.fitness > mejor.fitness ? individuo : mejor;
        });
        nuevaPoblacion.push(mejorIndividuo);
        cantidadHijos--;
      }
      // Ciclo para llenar la nueva tabla
      while (cantidadHijos > 0) {
        const padre1 = this.seleccionarPadre();
        const padre2 = this.seleccionarPadre();
        const [hijo1, hijo2] = this.cruzar(padre1, padre2);
        const hijo1Mutado = this.mutar(hijo1);
        const hijo2Mutado = this.mutar(hijo2);
        if (cantidadHijos === 1) {
          nuevaPoblacion.push(hijo1Mutado);
          cantidadHijos--;
          break;
        }
        nuevaPoblacion.push(hijo1Mutado);
        nuevaPoblacion.push(hijo2Mutado);
        cantidadHijos -= 2;
      }
      let mejorCromosoma = this.poblacion.reduce(
        (mejor, cromosoma) =>
          cromosoma.fitness > mejor.fitness ? cromosoma : mejor,
        this.poblacion[0]
      );
      mejoresCromosomas.push(mejorCromosoma.fitness);
      this.actualizarPoblacion(nuevaPoblacion);
      if (this.convergencia) {
        if (this.verificarConvergencia()) {
          console.log(`Convergencia alcanzada en la iteración ${i + 1}`);
          break;
        }
      }
    }
    return {
      tablaInicial: tablaInicial,
      fitnessInicial: fitnessInicial,
      tablaFinal: this.limitarDecimales(),
      fitnessFinal: this.calculoFitnessTotal(),
      mejoresCromosomas: mejoresCromosomas,
    };
  }
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
  convergencia,
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
    convergencia,
    xmin,
    xmax,
    elitismo,
    decimales,
  });

  let algoritmoFinalizado = algoritmo.ejecutar();
  return algoritmoFinalizado;
}
