/*  Add slide-to-next to an input field and it will automatically 
    slide to next card on change. Add slide-delay=500 to give it a short
    delay. 
*/

app.directive("slideToNext", ["$document", function($document) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            scope.slideDelay = +attrs.slideDelay || 0;
            var $elem = $(elem)

            var slideToNext = function() {
                setTimeout(function() {
                    var $nextCard = $elem.parents('.card').next('.card');

                    // Go back to first card if no next
                    if ($nextCard.length == 0) {
                        $nextCard = $elem.parents('.card').siblings('.card').first()
                    }
                    var target = angular.element($nextCard[0]);
                    $document.scrollToElement(target, 10, 500);
                }, scope.slideDelay);
            }
            /*  Trigger slide on click for buttons and model change for
                inputs.
            */ 
            if ($elem.prop("tagName") == "BUTTON") {
                $elem.click(slideToNext);
            }
            else {
                $elem.change(slideToNext);
            }

        }
    }
}]);