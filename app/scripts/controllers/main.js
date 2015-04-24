'use strict';

/**
 * @ngdoc function
 * @name sacoForaldraforsakringApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sacoForaldraforsakringApp
 */
angular.module('sacoForaldraforsakringApp')
  .controller('MainCtrl', function ($scope, $modal, calculator) {
    $scope.monthsMin = 1;
    $scope.monthsMax = 11;
    $scope.monthInterval = 0.5;

    $scope.parents = [
    	{
    		input: {
    			lonManad: 25000,
    			ledigaManader: 6,
    			foraldralonManader: 6
    		}
    	},
    	{
    		input: {
    			lonManad: 50000,
    			foraldralonManader: 6
    		}
    	}
    ];
    /*	
    */
    $scope.$watch('parents[0].input.ledigaManader', function(newVal, oldVal) {
    	$scope.parents[1].input.ledigaManader = 12 - newVal;
    })
    $scope.settings = {
    	// Mamma-pappa-läge är default.
    	hetero: true
    };

    /*	Ändra etiketter och ikoner i "onormativt" läge
    */
    $scope.$watch('settings.hetero', function(hetero) {
    	if (hetero) {
    		$scope.parents[0].label = "mamman";	
    		$scope.parents[1].label = "pappan";	
    	}
    	else {
    		$scope.parents[0].label = "förälder ett";	
    		$scope.parents[1].label = "förälder två";	    		
    	}   	
    })

    $scope.modal = function (msg) {
    	var modalInstance = $modal.open({
    		templateUrl: 'templates/modal-info.html',
    		controller: 'ModalInstanceCtrl',
    		size: 'sm',
    		resolve: {
    			data: function () {
    				return { msg: msg };
    			}
    		}
        });
    };

    

 	$scope.$watch("parents[0].input", calculateIncome, true);
 	$scope.$watch("parents[1].input", calculateIncome, true);


    $scope.options = {
        series: [
            {
                y: "totalNetto",
                label: "Hushållets inkomst",
                color: "#1f77b4",
                axis: "y",
                type: "area",
                thickness: "1px",
                dotSize: 2,
                id: "total-netto"
            },
            {
                y: "FLnetto",
                label: "Föräldralön",
                color: "#ff7f0e",
                axis: "y",
                type: "area",
                thickness: "1px",
                dotSize: 2,
                id: "foraldralon"
            },
        ],
        stacks: [{
                axis: "y",
                series: ["total-netto", "foraldralon"]
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
                min: 350000,
                ticks: 5
            }
        },
        lineMode: "linear",
        tension: 0.7,
        tooltip: {
            mode: "scrubber",
            formatter: function(x,y,series) {
                return x + "-" + (12 - x) + ": " + Math.round(y);
            } 
        },
        drawLegend: true,
        drawDots: true,
        columnsHGap: 5
    };





    $scope.data = [];

    for (var m = $scope.monthsMin; m <= $scope.monthsMax; m += $scope.monthInterval) {
        var w1 = $scope.parents[0].input.lonManad;
        var w2 = $scope.parents[1].input.lonManad;
        var fm1 = $scope.parents[0].input.foraldralonManader;
        var fm2 = $scope.parents[1].input.foraldralonManader;
        var m1 = m;
        var m2 = 12 - m;

        var spec1 = calculator.inkomstSpec(w1, m1, fm1);
        var spec2 = calculator.inkomstSpec(w2, m2, fm2);

        var totalNetto = spec1.totalNetto.value + spec2.totalNetto.value;
        var FLnetto = spec1.FLnetto.value + spec2.FLnetto.value;

        $scope.data.push({
            x: m,
            totalNetto: totalNetto - FLnetto,
            FLnetto: FLnetto
        });
    }
    
 
    function calculateIncome() {
    	var w1 = $scope.parents[0].input.lonManad;
    	var w2 = $scope.parents[1].input.lonManad;
    	var m1 = $scope.parents[0].input.ledigaManader;
    	var m2 = $scope.parents[1].input.ledigaManader;
    	var fm1 = $scope.parents[0].input.foraldralonManader;
    	var fm2 = $scope.parents[1].input.foraldralonManader;

    	$scope.parents[0].inkomstSpec = calculator.inkomstSpec(w1, m1, fm1);
    	$scope.parents[1].inkomstSpec = calculator.inkomstSpec(w2, m2, fm2);    	
    }
  });
/*
FRÅGOR:
- Hur räkna ut föräldralön med olika antal månader
*/
