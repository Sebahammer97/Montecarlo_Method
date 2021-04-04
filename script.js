(function (document, window) {
  // Funcion para obtener los elementos por id del html
  function getById(id) {
    return document.getElementById(id);
  }

  // Variables globales
  let funcion = "";
  let x_from = 0;
  let x_to = 0;
  let y_from = 0;
  let y_to = 0;
  let cant_points = "";
  let calculateBtn = getById("calculate");
  let ctx = getById("graphic");
  let chart = {};
  let data = {};
  let funcionPoints = [];
  let areaPoints = [];
  let insidePoints = [];
  let outsidePoints = [];

  // Inicializar el grafico
  function initialize() {
    chart = new Chart(ctx, {
      options: {
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom",
              display: true,
              gridLines: {
                zeroLineColor: "#333",
              },
              scaleLabel: {
                display: true,
                labelString: "x",
              },
            },
          ],
          yAxes: [
            {
              type: "linear",
              display: true,
              position: "left",
              gridLines: {
                zeroLineColor: "#333",
              },
              scaleLabel: {
                display: true,
                labelString: "F(x)",
              },
            },
          ],
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: "xy",
              speed: 5,
              threshold: 10,
            },
            zoom: {
              enabled: true,
              drag: false,
              mode: "xy",
              speed: 0.1,
              limits: {
                max: 5,
                min: 0.5,
              },
            },
          },
        },
      },
      data: [],
      type: "scatter",
    });
  }

  // Inicializacion de proceso de calculo de area
  calculateBtn.onclick = function () {
    funcion = getById("function").value;
    x_from = parseInt(getById("x_from").value);
    x_to = parseInt(getById("x_to").value);
    cant_points = parseInt(getById("points").value);

    if (verifyInputs()) {
      resetPoints();

      getFuncionPoints();
      getAreaPoints();
      getRandomPoints();

      renderChart();

      let integral_result = getIntegralResult();
      getById("integral_result").textContent = integral_result;
      let aprox_result = getAproxResult();
      getById("aprox_result").textContent = aprox_result;
      getById("error_results").textContent = Math.abs(
        integral_result - aprox_result
      );
    }
  };

  // Funcion que verifica los inputs
  function verifyInputs() {
    // Creacion de una expresion regular para verificar los inputs
    const reg = /^-?\d+$/;

    // Verificacion de los inputs
    try {
      if (funcion === "") {
        throw new Error("Por favor escriba una función.");
      }
      if (!reg.test(x_from)) {
        throw new Error(
          "Por favor escriba un número entero en el valor de inicio de la integral."
        );
      }
      if (!reg.test(x_to)) {
        throw new Error(
          "Por favor escriba un número entero en el valor final de la integral."
        );
      }
      if (!reg.test(cant_points)) {
        throw new Error(
          "Por favor escriba un número entero para la cantidad de puntos a evaluar."
        );
      }
    } catch (error) {
      alert(error);
      return false;
    }

    // Pasar los inputs a integer
    x_from = parseInt(x_from);
    x_to = parseInt(x_to);
    cant_points = parseInt(cant_points);

    return true;
  }

  // Funcion para resetar todos los puntos del grafico
  function resetPoints() {
    funcionPoints = [];
    areaPoints = [];
    insidePoints = [];
    outsidePoints = [];
  }

  // Funcion para obtener los puntos de la funcion
  function getFuncionPoints() {
    let x = x_from,
      step = 0.25;
    while (x <= x_to) {
      funcionPoints.push({ x: x, y: evaluate(x, funcion) });
      x += step;
    }
  }

  // Funcion para obtener el area a observar
  function getAreaPoints() {
    funcionPoints.map(function (point) {
      if (point.y > 0) {
        y_to = point.y > y_to ? point.y : y_to;
      } else {
        y_from = point.y < y_from ? point.y : y_from;
      }
    });

    areaPoints.push({ x: x_from, y: y_from });
    areaPoints.push({ x: x_to, y: y_from });
    areaPoints.push({ x: x_to, y: y_to });
    areaPoints.push({ x: x_from, y: y_to });
    areaPoints.push({ x: x_from, y: y_from });
  }

  // Funcion para obtener puntos aleatorios dentro del area marcada
  function getRandomPoints() {
    let count = 0,
      x = 0,
      y = 0,
      y_function = 0;

    while (count < cant_points) {
      x = Math.random() * (x_to - x_from) + x_from;
      y = Math.random() * (y_to - y_from) + y_from;

      y_function = evaluate(x, funcion);

      if (y > 0) {
        y < y_function
          ? insidePoints.push({ x: x, y: y })
          : outsidePoints.push({ x: x, y: y });
      } else {
        y > y_function
          ? insidePoints.push({ x: x, y: y })
          : outsidePoints.push({ x: x, y: y });
      }

      count++;
    }
  }

  // Funcion para evaluar los valores de x e y en la funcion
  function evaluate(x, funcion) {
    while (funcion.includes("sin")) {
      let sin =
        funcion.match(/sin\((.)\)/)[1] === "x" ? Math.sin(x) : Math.sin(y);
      let variable = funcion.match(/sin\((.)\)/)[1];
      funcion = funcion.replace("sin(" + variable + ")", sin);
    }
    while (funcion.includes("cos")) {
      let cos =
        funcion.match(/cos\((.)\)/)[1] === "x" ? Math.cos(x) : Math.cos(y);
      let variable = funcion.match(/cos\((.)\)/)[1];
      funcion = funcion.replace("cos(" + variable + ")", cos);
    }
    while (funcion.includes("sqrt")) {
      let sqrt =
        funcion.match(/sqrt\((.)\)/)[1] === "x" ? Math.sqrt(x) : Math.sqrt(y);
      let variable = funcion.match(/sqrt\((.)\)/)[1];
      funcion = funcion.replace("sqrt(" + variable + ")", sqrt);
    }
    return eval(funcion);
  }

  // Funcion para dibujar el grafico
  function renderChart() {
    let datasets = [];

    if (funcionPoints.length > 0) {
      datasets.push({
        label: funcion,
        data: funcionPoints,
        borderColor: "purple",
        borderWidth: 2,
        fill: false,
        showLine: true,
        pointBackgroundColor: "purple",
        radius: 0,
      });
    } else {
      alert("No hay puntos para la funcion.");
    }

    if (areaPoints.length > 0) {
      datasets.push({
        label: "Area",
        data: areaPoints,
        borderColor: "blue",
        borderWidth: 2,
        fill: true,
        showLine: true,
        pointBackgroundColor: "blue",
        tension: 0,
        radius: 0,
      });
    } else {
      alert("No hay puntos para el area.");
    }

    if (insidePoints.length > 0) {
      datasets.push({
        label: "Punto aleatorio por debajo de la función",
        data: insidePoints,
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        showLine: false,
        pointBackgroundColor: "green",
      });
    } else {
      alert("No hay puntos aleatorios.");
    }

    if (outsidePoints.length > 0) {
      datasets.push({
        label: "Punto aleatorio por arriba de la función",
        data: outsidePoints,
        borderColor: "red",
        borderWidth: 2,
        fill: false,
        showLine: false,
        pointBackgroundColor: "red",
      });
    } else {
      alert("No hay puntos aleatorios.");
    }

    data = { datasets };

    if (chart) {
      chart.data = data;
      chart.update();
    }
  }

  // Funcion para obtener el valor de la integral
  function getIntegralResult() {
    let total = 0,
      step = 0.01;
    for (let x = x_from; x < x_to; x += step) {
      total += Math.pow(x + step / 2, 0.5) * step;
    }
    return total;
  }

  // Funcion para obtener un valor aproximado de la integral
  function getAproxResult() {
    return ((insidePoints.length + 1) / cant_points) * (x_to - x_from) * y_to;
  }

  initialize();
})(document, window);

// Bibliografía
// https://codepen.io/83338a/pen/QrvKYY
// https://dirask.com/posts/JavaScript-how-to-use-Monte-Carlo-method-to-calculate-pi-constant-number-MDgJo1
// https://demo.wiris.com/mathtype/en/
// http://toreaurstad.blogspot.com/2017/08/integrals-in-math-with-javascript.html
