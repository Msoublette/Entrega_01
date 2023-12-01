DATASET1 = "csv/impacto_medioambiental_fastfashion_database.csv"
DATASET2 = "csv/impacto_materiales_textiles_database.csv"
DATASET3 = "csv/marcas_sustentables_chile_database.csv"

// gráfico subtema 1
const WIDTH_VIS_1 = 700;
const HEIGHT_VIS_1 = 300;
const WIDTH_GRAFICO1 = 600;
const HEIGHT_GRAFICO1 = 250;
const MARGIN_X1 = (WIDTH_VIS_1 - WIDTH_GRAFICO1) / 2;
const MARGIN_Y1 = (HEIGHT_VIS_1 - HEIGHT_GRAFICO1) / 2;

const SVG1 = d3.select("#grafico1").append("svg").attr("width", WIDTH_VIS_1).attr("height", HEIGHT_VIS_1);

d3.dsv(";", DATASET1).then(function(data) {
    // Convertir las ventas netas anuales a números
    data.forEach(function(d) {
        d["Ventas netas anuales (en millones de dólares)"] = +d["Ventas netas anuales (en millones de dólares)"].replace(/\$|,| millones de dólares/g, "");
    });

    // Calcular la frecuencia de cada país en el dataset
    var frecuenciaPaises = {};
    data.forEach(function(d) {
        var pais = d.País;
        frecuenciaPaises[pais] = (frecuenciaPaises[pais] || 0) + 1;
    });
    var datosFrecuencia = Object.entries(frecuenciaPaises);

    // Escala para el eje x e y
    var escalaX1 = d3.scaleBand()
        .domain(datosFrecuencia.map(d => d[0]))
        .range([0, WIDTH_GRAFICO1])
        .padding(0.1);
    var escalaY1 = d3.scaleLinear()
        .domain([0, d3.max(datosFrecuencia, d => d[1])])
        .range([HEIGHT_GRAFICO1, 0]);

    // Crear ejes
    var ejeX1 = d3.axisBottom(escalaX1);
    var ejeY1 = d3.axisLeft(escalaY1);

    var grafico1 = SVG1.append("g").attr("transform", "translate(" + MARGIN_X1 + "," + MARGIN_Y1 + ")");

    // Dibujar las barras del gráfico
    grafico1.selectAll("rect")
    .data(datosFrecuencia)
    .enter().append("rect")
    .attr("x", function(d) { return escalaX1(d[0]); })
    .attr("y", function(d) { return escalaY1(d[1]); })
    .attr("width", escalaX1.bandwidth())
    .attr("height", function(d) { return HEIGHT_GRAFICO1 - escalaY1(d[1]); })
    .attr("fill", "#FFD4D4");

    // Agregar ejes al SVG
    grafico1.append("g")
        .attr("transform", "translate(0," + HEIGHT_GRAFICO1 + ")")
        .call(ejeX1);

    grafico1.append("g")
        .call(ejeY1);

}).catch(function(error) {
    console.error("Error al cargar datos:", error);
});


// gráfico subtema 3
const WIDTH_VIS_3 = 1200;
const HEIGHT_VIS_3 = 400;
const SVG3 = d3.select("#grafico3").append("svg").attr("width", WIDTH_VIS_3).attr("height", HEIGHT_VIS_3);

d3.dsv(";", DATASET3).then(function(data) {
    // Filtrar datos que tengan información en la columna deseada
    var datosFiltrados = data.filter(function(d) {
        return d['5. ¿Qué mecanismo o material sustentable utiliza?'];
    });

    var categorias = {
        'Materiales renovables y de origen natural': 0,
        'Segunda mano':0, 
        'Zero Waste': 0, 
        'Técnicas artesanales': 0, 
        'Materiales reutilizados de origen orgánico. ': 0, 
        'Desechos post industriales': 0, 
        'Slow Fashion': 0,
        'Algodón orgánico y reciclaje': 0, 
        'Telas y fibras naturales': 0, 
        'De reciclaje o desecho textil': 0
    };

    datosFiltrados.forEach(function(d) {
        var categoria = d['5. ¿Qué mecanismo o material sustentable utiliza?'];
        if (categorias.hasOwnProperty(categoria)) {
            categorias[categoria]++;
        } else {
            categorias['De reciclaje o desecho textil']++;
        }
    });

    var dataCategorias = Object.entries(categorias);

    var escalaX3 = d3.scaleBand()
        .domain(dataCategorias.map(d => d[0]))
        .range([0, 1000])
        .padding(0.1);

    var escalaY3 = d3.scaleLinear()
        .domain([0, d3.max(dataCategorias, d => d[1])])
        .range([200, 0]);
        
    var ejeX3 = d3.axisBottom(escalaX3);
    var ejeY3 = d3.axisLeft(escalaY3);

    var grafico3 = SVG3.append("g").attr("transform", "translate(100, 50)");

    grafico3.selectAll("rect")
        .data(dataCategorias)
        .enter().append("rect")
        .attr("x", d => escalaX3(d[0]))
        .attr("y", d => escalaY3(d[1]))
        .attr("width", escalaX3.bandwidth())
        .attr("height", d => 200 - escalaY3(d[1]))
        .attr("fill", "#FFD4D4");

    grafico3.append("g")
        .attr("transform", "translate(0," + 200 + ")")
        .call(ejeX3)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    grafico3.append("g")
        .call(ejeY3);

}).catch(function(error) {
    console.error("Error al cargar datos:", error);
});


// gráfico subtema 2
const WIDTH_VIS_2 = 500;
const HEIGHT_VIS_2 = 400;
const SVG2 = d3.select("#grafico2").append("svg").attr("width", WIDTH_VIS_2).attr("height", HEIGHT_VIS_2);

d3.dsv(";", DATASET2).then(function(data) {
    data.forEach(d => {
        d['¿Biodegradable?'] = d['¿Biodegradable?'].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    });

    var biodegradables = data.filter(d => d['¿Biodegradable?'] === 'si');
    var noBiodegradables = data.filter(d => d['¿Biodegradable?'] === 'no');

    var conteoBiodegradables = biodegradables.length;
    var conteoNoBiodegradables = noBiodegradables.length;

    var conteos = [conteoBiodegradables, conteoNoBiodegradables];

    var WIDTH_GRAFICO2 = 300;
    var HEIGHT_GRAFICO2 = 300;
    var radio = Math.min(WIDTH_GRAFICO2, HEIGHT_GRAFICO2) / 2;

    // Escala de colores
    var color = d3.scaleOrdinal()
        .domain(conteos)
        .range(["#CDE990", "#AACB73"]);

    var grafico2 = SVG2.append("g").attr("transform", "translate(250, 160)");
    var pie = d3.pie();
    var arco = d3.arc()
        .innerRadius(0)
        .outerRadius(radio);

    grafico2.selectAll("arc")
        .data(pie(conteos))
        .enter()
        .append("path")
        .attr("d", arco)
        .attr("fill", d => color(d.data));

    var leyenda = grafico2.selectAll(".leyenda")
        .data(conteos)
        .enter()
        .append("g")
        .attr("class", "leyenda")
        .attr("transform", function(d, i) {
            return "translate(" + (i * 170 - 150) + ",180)";
        });

    leyenda.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d));

    leyenda.append("text")
        .attr("x", 22)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d, i) {
            return i === 0 ? "Biodegradables" : "No Biodegradables";
        });

});

