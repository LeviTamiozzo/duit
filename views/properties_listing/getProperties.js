const getProperties = ($scope, tokkoApi, rargs) => {
  let args = {data: rargs.data, order: rargs.order, order_by: rargs.order_by, limit: rargs.limit ? rargs.limit : 20, offset: rargs.offset ? rargs.offset : 0}
  if (args.offset == 0) {
    $scope.apiReady = false;
    $scope.results = [];
    tokkoApi.find('property/get_search_summary', args, function(result) {
      let types = result.objects.property_types
      $scope.sideBarParams = {
        locations: result.objects.locations,
        types: types.sort((a, b) => b.count - a.count),
        subTypes: (() => {
          if ($scope.subTypeSelected && $scope.subTypeSelected.length > 0) {
            return [propertiesSubTypes[types[0].id].find(x => x.id === $scope.subTypeSelected[0])]
          } else {
            return types.length === 1 ? propertiesSubTypes[types[0].id] : [];
          }
        })(),
        operations: result.objects.operation_types.sort((a, b) => b.count - a.count),
        rooms: result.objects.suite_amount.sort((a, b) => b.count - a.count),
      };
      $scope.resultsCount = result.meta.total_count;
      $scope.$apply();
    });
  }
  tokkoApi.find('property/search', args, function(result){
    result.forEach((p) => {
      $scope.results.push({
        id: p.id,
        title: p.publication_title,
        address: p.address,
        agent: p.branch ? p.branch.name : '',
        area: p.type.id === 1 ? p.surface : p.roofed_surface,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency === 'ARS' ? '$' : p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        rooms: p.suite_amount ? p.suite_amount : 0,
        baths: p.bathroom_amount ? p.bathroom_amount : 0,
        parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
        cover_photo: p.photos.length > 0 ? p.photos[0].thumb : '/images/no-image.png',
        photos: p.photos.length > 0 ? p.photos : [{image: '/images/no-image.png'}],
        location: p.location,
        full_prop: p,
      });
    });
    $scope.results.length > 0 ? $scope.ifResults = true : $scope.ifResults = false;
    $scope.apiReady = true;
    $scope.stopInfiniteScroll = false;
    $scope.loadingMore = false;
    $scope.$apply();
    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
    $scope.updateChosen();
  });
}