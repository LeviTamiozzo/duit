const app = angular.module('duit', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('home', {
    url: '/',
    templateUrl: '/views/home/home.html',
  });
  $stateProvider.state('propertySearch', {
    url: '/propertySearch?args',
    templateUrl: '/views/listing/listing.html',
    // params: {args: null},
  });
  $stateProvider.state('contactUs', {
    url: '/contactUs',
    templateUrl: '/views/contact/contact.html'
  });
  $stateProvider.state('property', {
    url: '/property/:propertyId',
    templateUrl: '/views/property/property.html'
  });
  $stateProvider.state('agents', {
    url: '/agents',
    templateUrl: '/views/agents/agents.html'
  });
  $stateProvider.state('developments', {
    url: '/developments',
    templateUrl: '/views/home/home.html'
  });
});

app.controller('global', function($scope) {
  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0)
})