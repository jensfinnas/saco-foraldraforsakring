app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, data) {
  $scope.msg = data.msg;
  $scope.close = function () {
    $modalInstance.close();
  };
});