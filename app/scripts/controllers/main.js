'use strict';

/**
 * @ngdoc function
 * @name sacoForaldraforsakringApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sacoForaldraforsakringApp
 */
angular.module('sacoForaldraforsakringApp')
  .controller('MainCtrl', function ($scope, $modal) {
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
    		templateUrl: '/templates/modal-info.html',
    		controller: 'ModalInstanceCtrl',
    		size: 'sm',
    		resolve: {
    			data: function () {
    				return { msg: msg };
    			}
    		}
        });
    };

    /*	Räkna ut grundavdraget i kronor givet en förvärvsinkomst (FFI), dvs månadslön, och 
    	aktuellt prisbasbelopp (PBB). 
    */
    function getGA(FFI, PBB) {
    	if (FFI < 0.99 * PBB) {
    		return 0.423 * PBB;
    	}
    	else if (FFI < 2.72 * PBB) {
    		return 0.225 * PBB + 0.2 * FFI;
    	}
    	else if (FFI < 3.11 * PBB) {
    		return 0.770 * PBB;
    	}
    	else if (FFI < 7.88 * PBB) {
    		return 1.081 * PBB - 0.1 * FFI;
    	}
    	else {
    		return 0.293 * PBB;
    	}
    }
    /*	Räkna ut skatten i kronor givet en viss inkomst
    */
    function getSkatt(TI) {
    	// Obs! Lön per månad här
    	var GA = getGA( TI, PBB );

    	return ( TI - GA ) * KI +
    		Math.max(0, ( TI - GA - SG1 ) * 0.2 ) +
    		Math.max(0, ( TI - GA - SG2 ) * 0.05 );
    }
    /*	Räkna ut jobbskatteavdraget (JSA) i kronor givet en arbetsinkomst per månad (AI),
    	kommunal inkomstskatt (KI) och aktuellt prisbasbelop (PBB).
    */
    function getJSA (AI, KI, PBB) {
    	// Räkna ut grundavdraget
    	var GA = getGA(AI, PBB);

    	if (AI < 0.91 * PBB) {
    		return (AI - GA) * KI;
    	}
    	else if (AI < 2.94 * PBB) {
    		return (0.91 * PBB + 0.332 * ( AI - 0.91 * PBB ) - GA ) * KI;
    	}
    	else if (AI < 8.08 * PBB) {
    		return (1.584 * PBB + 0.111 * ( AI - 2.94 * PBB ) - GA ) * KI;
    	}
    	else if (AI < 13.48 * PBB) {
    		return ( 2.155 * PBB - GA ) * KI;
    	}
    	else {
    		return Math.max( 0, 2.155 * PBB - GA ) * KI - 0.03 * ( AI - 13.84 * PBB );
    	}
    }
    /*	Räkna ut föräldrapenningen (FP) per månad givet en månadslön och det aktuella prisbasbeloppet (PBB).
    */
    function getFP(lonManad, PBB) {
    	var lonAr = lonManad * 12;
    	var FPTak = PBB * 10
    	// Om lönen är över inkomsttaket:
    	if (lonAr > FPTak) {
    		return 0.8 * 0.97 * ( 10 * PBB / 365 ) * 30;
    	}
    	// Om lönen är under inkomsttaket:
    	else {
    		return (lonAr * 0.8 * 0.97 ) / 365 * 30;
    	}
    }

    /*	Räkna ut föräldralönen givet en viss månadslön och det aktuella prisbasbeloppet
    */
    function getFL(lonManad, PBB) {
    	var lonAr = lonManad * 12;
    	var FPTak = PBB * 10;
    	// Om lönen är över inkomsttaket:
    	if (lonAr > FPTak) {
    		return lonManad - 30 * 0.8 * 10 * PBB / 365 - 30 * 0.1 * lonAr / 365; 
    	}
    	// Om lönen är under inkomsttaket:
    	else {
    		return lonManad - 30 * 0.9 * lonAr / 365;
    	}
    }

    function getJB(ledigaManader, JBdag, JBreserveradeManader) {
    	// Antal månader som berättigar till JB
    	var manader = Math.min(ledigaManader, 12 - ledigaManader) - JBreserveradeManader;
    	return Math.max(manader, 0) * 30 * JBdag;
    }

    // Prisbasbelopp
    var PBB = 44500;
    // Kommunal inkomstskatt
    var KI = .3199;

    // Skiktgränser för statlig inkomstskatt
    var SG1 = 421800;
    var SG2 = 616100;

    // Jämstäldhetsbonus per dag
    var JBdag = 50;
    var JBreserveradeManader = 4;

    // Barnbidrag per månad
 	var BB = 1050;

 	$scope.$watch("parents[0].input", calculateIncome, true);
 	$scope.$watch("parents[1].input", calculateIncome, true);
    
 	var inkomstSpec = function(lonManad, ledigaManader, foraldralonManaderMax) {
 		var w = lonManad;
 		var jobbManader = 12 - ledigaManader;
 		var FP = getFP( w, PBB );
 		var FL = getFL( w, PBB );
 		var foraldralonManader = Math.min(foraldralonManaderMax, ledigaManader);
 		var inkomstskatt = getSkatt( w );
 		var JSA = getJSA( w, KI, PBB );
 		var skatteprocentUtanJSA = inkomstskatt / w;
 		var skatteprocentMedJSA = ( inkomstskatt - JSA ) / w;
 		var JB = getJB(ledigaManader, JBdag, JBreserveradeManader)
 		/*	Månadslön
 			- GA
 			= beskattningsbar inkomrt

 		*/
 		var inkomstSpec = {
 			'lonBrutto': {
 				label: 'Bruttolön',
 				value: w * jobbManader,
 				type: 'brutto',
 				order: 1
 			},
 			'lonNetto': {
 				label: 'Nettolön',
 				value: ( w - inkomstskatt - JSA ) * jobbManader,
 				type: 'netto',
 				order: 2
 			},
 			'FPbrutto': {
 				label: 'Föräldrapenning före skatt',
 				value: FP * ledigaManader,
 				type: 'brutto',
 				order: 3
 			},
 			'FPnetto': {
 				label: 'Föräldrapenning efter skatt',
 				value: ( FP - FP * skatteprocentUtanJSA ) * ledigaManader,
 				type: 'netto',
 				order: 4
 			},
            'skatteprocentUtanJSA': {
                label: 'Skatteprocent utan JSA',
                value: skatteprocentUtanJSA * 100,
                order: 2.5
            },
 			'FLbrutto': {
 				label: 'Föräldralön före skatt',
 				value: FL * foraldralonManader,
 				type: 'brutto',
 				order: 5
 			},
 			'FLnetto': {
 				label: 'Föräldralön efter skatt',
 				value: ( FL - FL * skatteprocentMedJSA ) * foraldralonManader,	
 				type: 'netto',
 				order: 6
 			},
            'skatteprocentMedJSA': {
                label: 'Skatteprocent med JSA',
                value: skatteprocentMedJSA * 100,
                order: 2.5
            },
 			'JB': {
 				label: 'Jämställdhetsbonus',
 				value: JB,
 				type: 'skattefri',
 				order: 7
 			},
 			'BB': {
  				label: 'Barnbidrag',
 				value: BB / 2 * 12,
 				type: 'skattefri',
 				order: 8			
 			},
 			'totalNetto': {
 				label: 'Total bruttoinkomst',
 				type: 'total',
 				value: 0,
 				order: 9
 			},
 			'totalBrutto': {
 				label: 'Total nettoinkomst',
 				type: 'total',
 				value: 0,
 				order: 10
 			}
 		}
 		angular.forEach(inkomstSpec, function(d, key) {
 			if (d.type == 'netto') {
 				inkomstSpec.totalNetto.value += d.value;
 			}
 			if (d.type == 'brutto') {
 				inkomstSpec.totalBrutto.value += d.value;
 			}
 			if (d.type == 'skattefri') {
 				inkomstSpec.totalNetto.value += d.value;
 				inkomstSpec.totalBrutto.value += d.value; 				
 			}
 		});
 		return inkomstSpec;
 			
 		/*[
 			{ label: "01 - Bruttolön", value: w * jobbManader },
 			{ label: "02 - Nettolön", value: ( w - inkomstskatt - JSA ) * jobbManader },
 			{ label: "03 - Föräldrapenning före skatt", value: FP * ledigaManader  },
 			{ label: "04 - Föräldrapenning efter skatt", value: ( FP - FP * skatteprocentUtanJSA ) * ledigaManader },
 			{ label: "05 - Föräldralön före skatt", value: FL * foraldralonManader },
 			{ label: "06 - Föräldralön efter skatt", value: ( FL - FL * skatteprocentMedJSA ) * foraldralonManader },
 			{ label: "07 - Jämställdhetsbonus", value: JB },
 			{ label: "08 - Barnbidrag", value: BB / 2 * 12 }
 		]*/    		
 	}

    function calculateIncome() {
    	var w1 = $scope.parents[0].input.lonManad;
    	var w2 = $scope.parents[1].input.lonManad;
    	var m1 = $scope.parents[0].input.ledigaManader;
    	var m2 = $scope.parents[1].input.ledigaManader;
    	var fm1 = $scope.parents[0].input.foraldralonManader;
    	var fm2 = $scope.parents[1].input.foraldralonManader;

    	$scope.parents[0].inkomstSpec = inkomstSpec(w1, m1, fm1);
    	$scope.parents[1].inkomstSpec = inkomstSpec(w2, m2, fm2);    	
    }
  });
/*
FRÅGOR:
- Hur räkna ut föräldralön med olika antal månader
*/
