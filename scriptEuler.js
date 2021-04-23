(function(document, window) {



    function getById(id) {
        return document.getElementById(id);
    }

    calculate.onclick = function() {

        var y = parseFloat(getById("yzero").value);
        var x = parseFloat(getById("xzero").value);
        var h = parseFloat(getById("h").value);
        var funcion = getById("mainEquation").value;
        var finalX = getById('xfinal');

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
            var valores = [];
            valores.push({ x: x, y: y });
            while (x < fX) {
                p1 = h * evaluar(y, x, funcion);
                p2 = h * evaluar((y + p1 / 2), (x + h / 2), funcion);
                p3 = h * evaluar((y + p2 / 2), (x + h / 2), funcion);
                p4 = h * evaluar((y + p3), (x + h), funcion);
                m = ((p1 + 2 * p2 + 2 * p3 + p4) / 6);
                y = y + m;
                x = x + h;
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