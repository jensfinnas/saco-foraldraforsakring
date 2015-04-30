/*  Watches height changes on a given element and executes a given callback.
    Example: <div ng-on-height-change="callbackFn"></div>	
*/
app.directive( 'ngOnHeightChange', function() {
    return {
    	restrict: 'A',
    	scope: {
    		callback: '=ngOnHeightChange'
    	},
        link: function( scope, elem, attrs ) {
            scope.$watch( function() {
                return elem.height();
            }, function(newVal) {
            	scope.callback();
            });
        }
    }

} )
