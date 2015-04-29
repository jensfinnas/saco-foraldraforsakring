app.directive('monthSlider', function() {
    return {
        restrict: 'E',
        transclude: false,
        controller: function($scope) {
        	$scope.tooltipLabel = function(v) {
        		return v + " månader";
        	};
        	$scope.showTooltip = 'hide';
        },
        templateUrl: 'templates/slider.html'
    }
});