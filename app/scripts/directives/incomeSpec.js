app.directive("incomeSpec", function($document) {
    return {
        restrict: "E",
        transclude: false,
        scope: {
        	parents: '=',
        	mode: '@'
        },
        templateUrl: 'templates/income-spec.html',
        link: function(scope, elem, attrs) {
        	scope.rows = [ 'lonBrutto','FPbrutto','FLbrutto','JB','BB','totalBrutto','totalNetto' ];
            //scope.fullMode = scope.mode == 'full';
        }
    }
});