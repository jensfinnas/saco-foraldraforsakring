app.factory('chart', function ($filter) {
    var formatCurrency = $filter('currency');
    var service = {};
    var d3locale = d3.locale({
      "decimal": ",",
      "thousands": "\xa0",
      "grouping": [3],
      "currency": ["", " kr"],
      "dateTime": "%A %e %B %Y kl. %X",
      "date": "%d.%m.%Y",
      "time": "%H:%M:%S",
      "periods": ["AM", "PM"],
      "days": ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"],
      "shortDays": ["må", "ti", "ons", "to", "fre", "lö", "sö"],
      "months": ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
      "shortMonths": ["jan", "feb", "mars", "apr", "maj", "jun", "jul", "aug", "sept", "okt", "nov", "dec"]
    });

    service.options = {
        series: [
            // Lower area
            {
                y: "disponibelInkomst",
                label: "Hushållets inkomst",
                color: "#008ea1",
                axis: "y",
                type: "area",
                thickness: "1px",
                dotSize: 3,
                striped: false,
                id: "disponibelInkomst" // id has to be same as y
            },
            // Upper area
            {
                y: "FLnetto",
                label: "Föräldralön",
                color: "#E27748",
                axis: "y",
                type: "area",
                thickness: "1px",
                dotSize: 3,
                striped: true,
                id: "FLnetto"
            },
        ],
        stacks: [{
                axis: "y",
                series: ["disponibelInkomst", "FLnetto"]
        }],
        axes: {
            x: {
                type: "linear",
                labelFunction: function (v) {
                    return "";//v + "+" + ( 12 - v ); 
                },
                key: "x"
            },
            y: {
                type: "linear",
                labelFunction: function(value) {
                    return "";d3locale.numberFormat(".2s")(value);
                },
                ticks: 5
            }
        },
        lineMode: "linear",
        tension: 0.7,
        dimensions: {
            right: 5,
            left: 5
        },
        tooltip: {
            mode: "scrubber",
            formatter: function(x,y,stackTotal,series) {
                // Tooltip for total
                if (series.y == "disponibelInkomst") {
                    return 'Varav föräldralön: ' + formatCurrency(stackTotal - y, undefined, 0);
                }
                else if (series.y == 'FLnetto') {
                    return 'Total inkomst: ' + formatCurrency(stackTotal, undefined, 0);
                };
            } 
        },
        drawLegend: true,
        drawDots: true,
        columnsHGap: 5
    };


    return service;

});