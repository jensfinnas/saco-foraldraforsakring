app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, params) {
	$scope.params = params;
	$scope.close = function () {
		$modalInstance.close();
	};
});