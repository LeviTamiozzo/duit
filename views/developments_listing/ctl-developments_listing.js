app.controller('devsListing', function($rootScope, $scope, tokkoApi){
  $rootScope.activeMenu = 'developments';

  $scope.results = [];
  $scope.resultsMapped = [];
  $scope.resultsCount = 0;
  $scope.apiReady = false;
  $scope.ifResults = true;

  let args = {order: 'desc', limit: 100};

  tokkoApi.find('development', args, function(result) {
    $scope.results = result;
    $scope.resultsMapped = result.map(develop => {    
      return {
        id: develop.id,
        name: develop.name,
        location: develop.location,
        photos: develop.photos,
        hRef: `/#!/development/${develop.id}`
      };
    });

    $scope.resultsCount = result.length;

    if ($scope.resultsCount == 0) $scope.ifResults = false;

    $scope.apiReady = true;
    $scope.$apply();

    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
  });

});