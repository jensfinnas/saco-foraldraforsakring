'use strict';

/**
 * @ngdoc function
 * @name sacoForaldraforsakringApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sacoForaldraforsakringApp
 */
angular.module('sacoForaldraforsakringApp')
  .controller('MainCtrl', function ($scope, $modal, $filter, $timeout, calculator, chart) {
    $scope.monthsMin = 1;
    $scope.monthsMax = 11;
    $scope.monthInterval = 1;
    var formatCurrency = $filter('currency');

    $scope.forms = { userInput: {} };

    $scope.parents = [
    	{
    		input: {
    			lonManad: 24000,
    			ledigaManader: 6,
    			foraldralonManader: 6
    		}
    	},
    	{
    		input: {
    			lonManad: 48000,
    			foraldralonManader: 0
    		}
    	}
    ];

    $scope.max = {
        ledigaManader: [],
        totalNetto: 0
    }

    $scope.showResults = false;
    $scope.validate = function() {
        if ($scope.forms.userInput.$invalid) {
            $scope.showResults = false;
        }
        else {
            $scope.showResults = true;
            /*  Chart renders incorrecly (wrong width) when container is hidden.
                We therefore force a redraw after card has been rendered
            */
            $timeout(function() {
                $scope.$broadcast('redraw-chart');
            })
        }  
    }
    /*	
    */
    $scope.$watch('parents[0].input.ledigaManader', function(newVal, oldVal) {
    	$scope.parents[1].input.ledigaManader = 12 - newVal;
    })
    /*  Om lön eller antalet föräldralönsmånader förändras ritas hela grafiken om.
    */
    $scope.$watchGroup([
        'parents[0].input.lonManad',
        'parents[1].input.lonManad',
        'parents[0].input.foraldralonManader',
        'parents[1].input.foraldralonManader'
        ], updateChartData);

    /*  Om fördelning av lediga månader (slidern) förändras räknas familjens totalinkomst
        om. Grafiken behöver däremot inte uppdateras.
    */
    $scope.$watchGroup([
        'parents[0].input.ledigaManader',
        'parents[1].input.ledigaManader'
        ], updateFamilyIncome)


    $scope.settings = {
    	// Mamma-pappa-läge är default.
    	hetero: true
    };

    /*	Ändra etiketter och ikoner i "onormativt" läge
    */
    $scope.$watch('settings.hetero', function(hetero) {
    	if (hetero) {
    		$scope.parents[0].icon = 'images/woman.png';
            $scope.parents[0].label = 'mamman';

            $scope.parents[1].icon = 'images/man.png';
            $scope.parents[1].label = 'pappan';
    	}
    	else {
            $scope.parents[0].icon = 'images/woman.png';
            $scope.parents[0].label = 'förälder ett';

            $scope.parents[1].icon = 'images/woman.png';
            $scope.parents[1].label = 'förälder två';    		
    	}   	
    })

    $scope.modal = function (templateUrl, params) {
        var params = params || {};
    	var modalInstance = $modal.open({
    		templateUrl: templateUrl,
    		controller: 'ModalInstanceCtrl',
    		size: params.size || 'sm',
    		resolve: {
    			params: function () {
    				return params;
    			}
    		}
        });
    };

    



    $scope.chartOptions = chart.options;
    $scope.data = [];

    function updateFamilyIncome() {
        if ($scope.forms.userInput.$valid) {
            var m0 = $scope.parents[0].input.ledigaManader;
            var row = $scope.data.filter(function(d) {
                return d.m0 == m0;
            })[0];

            $scope.parents[0].inkomstSpec = row.inkomstSpec0;
            $scope.parents[1].inkomstSpec = row.inkomstSpec1;
        }
    }  
    function updateChartAxis() {
        $scope.chartOptions.axes.y.min = d3.min($scope.data.map(function(d) {
            return d.totalNetto * 0.9;
        }));
    }
 
    function updateChartData() {
        if ($scope.forms.userInput.$valid) {
            var w0 = $scope.parents[0].input.lonManad;
            var w1 = $scope.parents[1].input.lonManad;
            var fm0 = $scope.parents[0].input.foraldralonManader;
            var fm1 = $scope.parents[1].input.foraldralonManader;

            // Nollställ data och max-inkomst
            $scope.data = [];
            $scope.max.totalNetto = 0;

            for (var m = $scope.monthsMin; m <= $scope.monthsMax; m += $scope.monthInterval) {
                var m0 = m;
                var m1 = 12 - m;

                var spec0 = calculator.inkomstSpec(w0, m0, fm0);
                var spec1 = calculator.inkomstSpec(w1, m1, fm1);

                var totalNetto = spec0.totalNetto.value + spec1.totalNetto.value;
                var FLnetto = spec0.FLnetto.value + spec1.FLnetto.value;

                $scope.data.push({
                    m0: m0,
                    m1: m1,
                    inkomstSpec0: spec0,
                    inkomstSpec1: spec1,
                    x: m,
                    totalNetto: totalNetto - FLnetto,
                    FLnetto: FLnetto,
                    sum: totalNetto
                });

                /*  Spara maxvärdet lättillgängligt i scopet.
                */
                if (totalNetto > $scope.max.totalNetto) {
                    $scope.max = {
                        ledigaManader: [m0, m1],
                        totalNetto: totalNetto
                    }
                }
            }

            updateFamilyIncome();
            updateChartAxis();
        }
    }
  });
/*
FRÅGOR:
- Hur räkna ut föräldralön med olika antal månader
*/
