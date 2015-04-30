app.factory('pym', function () {
    var service = {};
    var pymChild = null;
    service.isIframe = self !== top;

    if (service.isIframe) {
    	pymChild = new pym.Child();
    }
    service.sendHeight = function() {
    	if (pymChild) {
    		pymChild.sendHeight();
    	}
    }
    return service;

});