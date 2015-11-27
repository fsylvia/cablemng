'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap',
  'ngMessages',
  'ui.grid',
  'ui.grid.expandable', 
  'ui.grid.selection', 
  'ui.grid.pinning',
  'message.flash'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/customer/add-edit/:id', {templateUrl: 'partials/add-edit-customers.html', controller: 'AddEditCustomerCtrl'});
  $routeProvider.when('/customer', {templateUrl: 'partials/customers.html', controller: 'CustomerCtrl'});
  $routeProvider.when('/agent/add-edit/:id', {templateUrl: 'partials/add-edit-agent.html', controller: 'AddEditAgentCtrl'});
  $routeProvider.when('/agent', {templateUrl: 'partials/agent.html', controller: 'AgentCtrl'});
  $routeProvider.when('/payment', {templateUrl: 'partials/payment.html', controller: 'PaymentCtrl'});
  $routeProvider.when('/reports', {templateUrl: 'partials/reports.html', controller: 'ReportsCtrl'});
  $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminCtrl'});
  $routeProvider.otherwise({redirectTo: '/customer'});
}]);
