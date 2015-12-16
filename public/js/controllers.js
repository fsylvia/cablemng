'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AppCtrl', ['$scope', 'lookupFactory', function($scope, lookupFactory){
     /** get Lookups **/ 
      lookupFactory.getLookup('ID_TYPE').then(function(res){
        $scope.idprooftypes = res.data;
      }, function(err){
        console.log("Error in getting id proof types");
      });
      lookupFactory.getLookup('PAYMENT_TYPE').then(function(res){
        $scope.paymenttypes = res.data;
      }, function(err){
        console.log("Error in getting paid status types");
      });
      lookupFactory.getLookup('REASON_FOR_DEACTIVATION').then(function(res){
        $scope.deactivationreasons = res.data;
      }, function(err){
        console.log("Error in getting deactivation reason types");
      });
      lookupFactory.getLookup('AREA').then(function(res){
        $scope.areas = res.data;
      }, function(err){
        console.log("Error in getting id proof types");
      });
      lookupFactory.getLookup('PAYMENT_METHOD').then(function(res){
        $scope.paymentmethods = res.data;
      }, function(err){
        console.log('Error in getting payment methods');
      });

      $scope.months = [{'monthName': 'Jan'}, {'monthName': 'Feb'}, {'monthName': 'Mar'}, {'monthName': 'Apr'}, 
      {'monthName': 'May'}, {'monthName': 'Jun'}, {'monthName': 'Jul'}, {'monthName': 'Aug'},
      {'monthName': 'Sep'}, {'monthName': 'Oct'}, {'monthName': 'Nov'}, {'monthName': 'Dec'}];
      $scope.dateFormat="yyyy-MM-dd";
      $scope.datePattern = "";
      $scope.mobnoPattern = /^\d{10}$/;
      $scope.lndnoPattern = /^\d{11}$/;
      $scope.pymtduePattern = /^(([0]?[1-9])|([1]?[0-9])|(2[0]))$/;
      $scope.advamtPattern = /^([1-9][0-9][0])$/;
      $scope.subsamtPattern = /^([1-9][0-9][0]|[8-9][0])$/;
      
      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
      $scope.monthFormat="yyyy-MM";
      
      /** get Lookups **/
  }])
  .controller('AdminCtrl', ['$scope', 'lookupFactory', function($scope, lookupFactory){
    
    function getTypes(){
      lookupFactory.getLookupType().then(
        function(res){
          $scope.lookuptypes = res.data;
        },
        function(err){
          console.log("Error in getting lookup type data");
        });
    }

    function getLookup(){
      lookupFactory.getLookup().then(
        function(res){
          $scope.lookups = res.data;
        },
        function(err){
          console.log("Error in getting lookup data");
        });
    }
    $scope.deleteType = function(id){
      lookupFactory.deleteLookupType(id);
      getTypes();
    };

    $scope.addType = function(){
      lookupFactory.saveLookupType($scope.lookupTypeNew);
      getTypes();
    };

    $scope.addLookup = function(){
      lookupFactory.saveLookup($scope.lookupNew);
      getLookup();
    };

    $scope.deleteLookup = function(id){
      lookupFactory.deleteLookup(id);
      getLookup();
    };

    getTypes();
    getLookup();
    
  }])
  .controller('CustomerCtrl', ['$scope', '$filter', 'customersFactory', 'connectionFactory', 'uiGridConstants', 'agentsFactory', 'paymentsFactory', 'flashMessageService',
    function($scope, $filter, customersFactory, connectionFactory, uiGridConstants, agentsFactory, paymentsFactory, flashMessageService) {
      $scope.currentYear = new Date().getFullYear();
      $scope.previousMonth = $filter('monthName')(new Date().getMonth() -1);
      $scope.payment = {'paidmonth' : $scope.previousMonth, 'paidyear' : $scope.currentYear, 'paymenttype' : 'Subscription'};
      
      agentsFactory.getAgents().then(function(res){
        $scope.agents = res.data;
      })
       
      var getCustomers = function (){  
        customersFactory.getActiveCustomers().then(function(res){
          $scope.gridOptions.data = res.data;
          angular.forEach($scope.gridOptions.data,function(row){
            row.getAddress = function(){
              return this.address.street1 + ', ' + this.address.street2 + ', ' + this.address.area;
            }
            row.getContacts = function() {
              var contacts = this.contacts.mobileno;
              if(this.contacts.landlineno != null)
                contacts = this.contacts.landlineno + ', ' + contacts;
              return contacts;
            }
          });
        }, function(err){
          console.log('Error in getting customer list'+err.message);
        }); 
      };
      getCustomers();
      $scope.columns = [
      {
        field: 'active', 
        displayName: 'Active',
        width:"70" ,
        cellTemplate: '<div class="ui-grid-cell-contents"><img ng-if="COL_FIELD" ng-src="img/truetick.png"/><img ng-if="!COL_FIELD" ng-src="img/falsecross.png"/></div>',
        filter: {term: true}
      },
      {field: 'uniqcustid', displayName : 'Customer ID', width: 150},
      {field: 'customername', displayName : 'Customer Name', width: 150 }, 
      {field: 'getAddress()',  displayName: 'Address', width: "300", filter: {condition: uiGridConstants.filter.CONTAINS}},
      {field: 'getContacts()',  displayName: 'Contact No', filter: {condition: uiGridConstants.filter.CONTAINS}, width: "200"},
      {field: 'paymentstatus', displayName : 'Paid Status', width: "90", cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
        
        if(grid.getCellValue(row, col) == 'Pending'){
          return 'alert-danger';
        }
      }},
      {field: 'paymentdue', displayName : 'Amount Due', width: "100", sort: {direction: uiGridConstants.DESC, priority: 0}},
      {
        field: '_id',
        enableFiltering: false,
        name: ' ', 
        cellTemplate: '<div class="ui-grid-cell-contents"><a href="#/customer/add-edit/{{ COL_FIELD }}" class="btn btn-success btn-xs" >Edit</a></div>',
        width: "50"
      }];
     
      $scope.savePayment = function(connection){
        $scope.payment = connection.payment;
        $scope.payment.connectionId = connection._id;
        $scope.payment.customerId = connection.customerid;
        
        if($scope.payment.paidamt == null || isNaN($scope.payment.paidamt) || 
          $scope.payment.paidyear == null || isNaN($scope.payment.paidyear) || 
          $scope.payment.paidto == undefined || $scope.payment.paidmonth == undefined){
          flashMessageService.setMessage("Payment not saved. Please enter valid values for payment");
        } else {
          paymentsFactory.addPayment($scope.payment).then(function(res){
              getCustomers();
              flashMessageService.setMessage("Payment Saved Successfully");
          });
        }
      
        
      }

      
      $scope.gridOptions = {
        enableFiltering: true,
        columnDefs: $scope.columns,
        rowHeight: 40,
        expandableRowTemplate: 'partials/expandableRowTemplate.html',
        expandableRowHeight: 150,
        
        onRegisterApi: function (gridApi) {
               
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {

                if (row.isExpanded) {
                  row.entity.subGridOptions = {
                    appScopeProvider: $scope,
                    rowHeight: 40,
                    columnDefs: [
                    {name: "address", displayName: 'Address', cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD.street1}},  {{COL_FIELD.street2}},  {{COL_FIELD.area}}</div>',
                      width: "300"},
                    {name: "payment.paidamt", displayName: 'Paid Amt', cellTemplate: '<div class="ui-grid-cell-contents"><input type="number" ng-model="row.entity.payment.paidamt"/></div>'},
                    {name: "payment.paidyear", displayName: 'Paid Year', cellTemplate: '<div class="ui-grid-cell-contents"><input type="number" ng-model="row.entity.payment.paidyear"/></div>'},
                    {name: "payment.paidmonth", displayName: 'Paid Month', cellTemplate: '<div class="ui-grid-cell-contents"><select id="paidmonth" ng-model="row.entity.payment.paidmonth"><option ng-repeat="month in grid.appScope.months" value="{{month.monthName}}">{{month.monthName}}</option></select></div>'},
                    {name: "payment.paidto", displayName: 'Agent', cellTemplate: '<div class="ui-grid-cell-contents"><select id="paidto" ng-model="row.entity.payment.paidto"><option ng-repeat="agent in grid.appScope.agents" value="{{agent.agentname}}">{{agent.agentname}}</option></select></div>'},
                    {name: 'amountdue', displayName: 'Amount Due'},
                    {name: "paymentstatus", displayName: 'Status'}, 
                    {field: "_id", displayName: ' ', cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.savePayment(row.entity)" class="btn btn-info btn-xs">Pay</button></div>'}
                  ]
                };
                  for(var i = 0; i<row.entity.connections.length; i++){
                    //preset values for payment entry
                    row.entity.connections[i].payment = {'paidamt' : row.entity.connections[i].subscriptionamt, 
                                                          'paidyear' : $scope.currentYear,
                                                          'paidmonth' : $scope.previousMonth
                                                        }
                  }
                  row.entity.subGridOptions.data = row.entity.connections;
                    
                }
            });
        }
      };
      
  }])
  .controller('AddEditCustomerCtrl', [
    '$scope', '$routeParams', 'lookupFactory', 'customersFactory', 'connectionFactory',  'paymentsFactory', 'flashMessageService', 
    function($scope, $routeParams, lookupFactory, customersFactory, connectionFactory, paymentsFactory, flashMessageService){
      $scope.customerId  = $routeParams.id;
      $scope.heading  = "Add a New  Customer";
      $scope.customer = {};
      $scope.showModal = false;
      $scope.modalHeading = "";
      $scope.displayConnections = false;

      function getCustomer(){
        customersFactory.getCustomer($scope.customerId).then(function(res){
          $scope.customer = res.data;
          $scope.customer.dateofbirth = new Date($scope.customer.dateofbirth);
        }, function(err){
          console.log("Error in finding customer data for Id : "+$scope.customerId + ".Error: "+err.message);
        });
      }
      
      $scope.openCal = function($event, flag) {
        if(flag =='dobstatus') $scope.dobStatus.opened = true;
        if(flag =='pfmstatus') $scope.pfmStatus.opened = true;
      };
      $scope.dobStatus = { opened: false };
      $scope.pfmStatus = { opened: false };
      if  ($scope.customerId !=  0)  {
        $scope.heading  = "Edit Customer";
        $scope.displayConnections = true;
        getCustomer();
      }


      $scope.saveCustomer = function(){
        customersFactory.saveCustomerDetails($scope.customer).then(function(res){
            $scope.customer = res.data;
            $scope.customerId = $scope.customer._id;
            $scope.displayConnections = true;
            flashMessageService.setMessage("Customer Saved Successfully");
         });
      };

      $scope.toggleModal = function(heading, connection){
         $scope.showModal = !$scope.showModal;
         $scope.modalHeading = heading;

         if($scope.showModal) {
           if (typeof connection != "undefined") {
              $scope.connection = connection;
              
              if($scope.modalHeading == 'View Payment'){
                paymentsFactory.getPayments(connection).then(function(res){
                  $scope.payments = res.data;
                });
              }
           }
           else {
              $scope.connection = {'customerid': $scope.customer.uniqcustid, 'active' : true, 'paymentdueon': 5, 'advanceamt':500, 'subscriptionamt':120};
              $scope.connection.address = $scope.customer.address;
           }
         }
         else{
            //clean this later
            getCustomer();
         }
      }

      $scope.resetAddress = function(){
        $scope.connection.address = {};
      }
      $scope.saveConnectionDetails = function(){
        $scope.connection.customerid = $scope.customer.uniqcustid;
        connectionFactory.saveConnectionDetails($scope.connection).then(function(res){
            $scope.toggleModal('');    
            flashMessageService.setMessage("Connection Saved Successfully");
          });
      };
      
     
      
  }])
  .controller('AgentCtrl', ['$scope', 'agentsFactory', 'uiGridConstants', function($scope, agentsFactory, uiGridConstants) {
     $scope.columns = [
      {
        field: 'active', 
        displayName: 'Active',
        width:"70" ,
        cellTemplate: '<div class="ui-grid-cell-contents"><img ng-if="COL_FIELD" ng-src="img/truetick.png"/><img ng-if="!COL_FIELD" ng-src="img/falsecross.png"/></div>'
      },
      {field: 'uniqagentid', displayName : 'Agent ID'},
      {field: 'agentname', displayName : 'Agent Name'}, 
      {field: 'getAddress()',  displayName: 'Address', filter: {condition: uiGridConstants.filter.CONTAINS}},
      {field: 'getContacts()',  displayName: 'Contact No', filter: {condition: uiGridConstants.filter.CONTAINS}},
      {
        field: '_id',
        enableFiltering: false,
        name: ' ', 
        cellTemplate: '<div class="ui-grid-cell-contents"><a href="#/agent/add-edit/{{ COL_FIELD }}" class="btn btn-success btn-xs" >Edit</a></div>',
        width: "50"
      }];
      
      $scope.gridOptions = {
        enableFiltering: true,
        columnDefs: $scope.columns
      }  
      agentsFactory.getAgents().then(function(res){
         $scope.gridOptions.data = res.data;
          angular.forEach($scope.gridOptions.data,function(row){
            row.getAddress = function(){
              return this.address.street1 + ', ' + this.address.street2 + ', ' + this.address.area;
            }
            row.getContacts = function() {
              var contacts = this.contacts.mobileno;
              if(this.contacts.landlineno != null)
                contacts = this.contacts.landlineno + ', ' + contacts;
              return contacts;
            }
          });
      })
  }])
  .controller('AddEditAgentCtrl', ['$scope', '$routeParams', 'lookupFactory', 'agentsFactory', 'flashMessageService', 
    function($scope, $routeParams, lookupFactory, agentsFactory, flashMessageService){
    $scope.agentId = $routeParams.id;
    $scope.header = "Add Agent";
    $scope.agent = {active: true};
    
    lookupFactory.getLookup('TERMINATION_REASONS').then(function(res){ $scope.terminationReasons = res.data;}, function(err){
      console.log("Error in getting termination reasons");
    });
    if($scope.agentId != 0){
      $scope.header = "Edit Agent";
      agentsFactory.getAgentById($scope.agentId).then(function(res){
        $scope.agent = res.data;
        $scope.agent.dateofbirth = new Date($scope.agent.dateofbirth);
        $scope.agent.startdate = new Date($scope.agent.startdate);
      });
    }
    $scope.openCal = function($event, flag) {
        if(flag =='dobstatus') $scope.dobStatus.opened = true;
        if(flag =='startstatus') $scope.startStatus.opened = true;
        
      };
      $scope.dobStatus = { opened: false };
      $scope.startStatus = { opened: false };
    $scope.saveAgent = function(){

      //refactor
      if($scope.agentId == 0){
        agentsFactory.addAgent($scope.agent).then(function(res){
          flashMessageService.setMessage("Agent Saved Successfully");
        })
      } else {
        agentsFactory.updateAgent($scope.agent).then(function(res){
          flashMessageService.setMessage("Agent Saved Successfully");
        })
      }
    }
  }])
  .controller('ReportsCtrl', ['$scope', function($scope) {

  }]);
