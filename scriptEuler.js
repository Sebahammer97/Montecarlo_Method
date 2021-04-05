(function(document, window) {

    // Variables Globales
    var finalX = getById('xfinal');

    function getById(id) {
        return document.getElementById(id);
    }

    calculate.onclick = function() {

        var y = parseFloat(getById("yzero").value);
        var x = parseFloat(getById("xzero").value);
        var h = parseFloat(getById("h").value);
        var funcion = getById("mainEquation").value;

        var eulerArray = euler(funcion, finalX.value, x, y, h)
        var eulerMejArray = eulerMejorado(funcion, finalX.value, x, y, h)
        var rungeKutta = r4(funcion, finalX.value, x, y, h)
        var n = eulerArray.length

        // Función de Euler
        function euler(funcion, xfinal, xinicial, yinicial, h) {
            var valores = [];
            var y = yinicial;
            var x = xinicial;
            valores.push({ x: x, y: y });
            while (x < xfinal) {
                y = y + h * evaluar(y, x, funcion);
                x = x + h;
                valores.push({ x: x, y: y });
            }
            return valores;
        }

        // Función de Euler Mejorado
        function eulerMejorado(funcion, xfinal, xinicial, yinicial, h) {
            var valores = [];
            var y = yinicial;
            var x = xinicial;
            var predictor;
            valores.push({ x: x, y: y });
            while (x < xfinal) {
                predictor = y + h * evaluar(y, x, funcion);
                y = y + (0.5) * (evaluar(y, x, funcion) + evaluar(predictor, x + h, funcion)) * h;
                x = x + h;
                valores.push({ x: x, y: y });
            }
            return valores;
        }

        // Función de Runge Kutta
        function r4(funcion, finalX, x, y, h) {
            var fX = finalX;
            console.log(finalX, x, x < fX)
            var i = 0;
            var valores = [];
            valores.push({ x: x, y: y });
            while (x < fX) {
                m1 = evaluar(y, x, funcion);
                m2 = evaluar((y + m1 * h / 2), (x + h / 2), funcion);
                m3 = evaluar((y + m2 * h / 2), (x + h / 2), funcion);
                m4 = evaluar((y + m3 * h), (x + h), funcion);
                m = ((m1 + 2 * m2 + 2 * m3 + m4) / 6);
                y = y + m * h;
                x = x + h;
                i++;
                valores.push({ x: x, y: y });
            }
            return valores;
        }

        function evaluar(y, x, funcion) {

            while (funcion.includes("sin")) {
                let sin = funcion.match(/sin\((.)\)/)[1] === "x" ? Math.sin(x) : Math.sin(y);
                let variable = funcion.match(/sin\((.)\)/)[1];
                funcion = funcion.replace("sin(" + variable + ")", sin);
            }
            while (funcion.includes("cos")) {
                let cos = funcion.match(/cos\((.)\)/)[1] === "x" ? Math.cos(x) : Math.cos(y);
                let variable = funcion.match(/cos\((.)\)/)[1];
                funcion = funcion.replace("cos(" + variable + ")", cos);
            }
            while (funcion.includes("sqrt")) {
                let sqrt = funcion.match(/sqrt\((.)\)/)[1] === "x" ? Math.sqrt(x) : Math.sqrt(y);
                let variable = funcion.match(/sqrt\((.)\)/)[1];
                funcion = funcion.replace("sqrt(" + variable + ")", sqrt);
            }
            return eval(funcion);
        }


        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            zoomEnabled: true,

            title: {
                text: "Selecciona el método debajo para ver/ocultar el grafico"
            },
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                }
            },
            axisY: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    labelFormatter: function(e) {
                        return CanvasJS.formatNumber(e.value, "0.00");
                    }
                }
            },
            legend: {
                cursor: "pointer",
                itemclick: function(e) {
                    //console.log("legend click: " + e.dataPointIndex);
                    //console.log(e);
                    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    } else {
                        e.dataSeries.visible = true;
                    }

                    e.chart.render();
                }
            },
            data: [{
                    type: "line",
                    name: "Euler",
                    color: "red",
                    showInLegend: true,
                    dataPoints: eulerArray
                },
                {
                    type: "line",
                    color: "orange",
                    name: "Euler Mejorado",
                    showInLegend: true,
                    dataPoints: eulerMejArray
                },
                {
                    type: "line",
                    color: "green",
                    showInLegend: true,
                    name: "Runge Kutta",
                    dataPoints: rungeKutta
                }
            ]
        });
        chart.render();

    };
})(document, window);