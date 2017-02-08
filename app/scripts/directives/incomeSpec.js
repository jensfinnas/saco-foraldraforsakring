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
        	scope.rows = [ 'lonBrutto','FP','FL','BB','disponibelInkomst' ];
        }
    }
});