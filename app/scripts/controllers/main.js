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
