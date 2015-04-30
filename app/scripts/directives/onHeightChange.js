/*	
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
            	console.log(scope.callback);
            	console.log("height changed!", newVal)
            });
        }
    }

} )
