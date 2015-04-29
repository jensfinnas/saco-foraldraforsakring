app.factory('chart', function ($filter) {
    var formatCurrency = $filter('currency');
    var service = {};

    service.options = {
        series: [
            // Lower area
            {
                y: "totalNetto",
                label: "Hushållets inkomst",
                color: "#008ea1",
                axis: "y",
                type: "area",
                thickness: "1px",
                dotSize: 3,
                striped: false,
                id: "totalNetto" // id has to be same as y
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
                series: ["totalNetto", "FLnetto"]
        }],
        axes: {
            x: {
                type: "linear",
                labelFunction: function (v) {
                    return v + "-" + ( 12 - v ); 
                },
                key: "x"
            },
            y: {
                type: "linear",
                labelFunction: function(v) {
                    return formatCurrency(v, '', 0);
                },
                ticks: 5
            }
        },
        lineMode: "linear",
        tension: 0.7,
        dimensions: {
            right: 10,
            left: 50
        },
        tooltip: {
            mode: "scrubber",
            formatter: function(x,y,stackTotal,series) {
                // Tooltip for total
                if (series.y == "totalNetto") {
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