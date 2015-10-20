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
      $scope.dateFormat="yyyy-MM-dd";
      $scope.datePattern = "";
      $scope.pincodePattern = /^\d{6}$/;
      $scope.mobnoPattern = /^\d{10}$/;
      $scope.lndnoPattern = /^\d{11}$/;
      $scope.pymtduePattern = /^(([0]?[1-9])|([1]?[1-9])|(2[0]))$/;
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
  .controller('CustomerCtrl', ['$scope', 'customersFactory', 'connectionFactory', 'uiGridConstants', 
    function($scope, customersFactory, connectionFactory, uiGridConstants) {
      customersFactory.getAllCustomers().then(
        function(res){
          $scope.gridOptions.data = res.data;
        }, function(err){
          console.log('Error in getting customer list'+err.message);
        });   
      
      $scope.columns = [{ field: 'uniqcustid', displayName : 'Customer ID'},
                        { field: 'customername', displayName : 'Customer Name' }, 
                        {field: 'address.street1', displayName : 'Door No'}, 
                        {field: 'address.street2', displayName : 'Street'}, 
                        {field: 'address.area', displayName : 'Area'}, 
                        {field: 'address.pincode', displayName : 'Pincode'}, 
                        {field: 'contacts.landlineno', displayName : 'LAND Line No'},
                        {field: 'contacts.mobileno', displayName : 'Mobile No'},
                        {field: 'paymentstatus', displayName : 'Paid'},
                        {field: 'paymentdue', displayName : 'Amount Due'},
                        {
                          field: '_id',
                          enableFiltering: false,
                          name: ' ', 
                          cellTemplate: '<div class="ui-grid-cell-contents"><a href="#/customer/add-edit/{{ COL_FIELD }}" class="btn btn-success btn-xs" >Edit</a></div>',
                          width: "50"
                        }];

      $scope.gridOptions = {
        enableFiltering: true,
        columnDefs: $scope.columns,
      };
      $scope.disableCustomer = function(){

      };
  }])
  .controller('AddEditCustomerCtrl', [
    '$scope', '$routeParams', 'lookupFactory', 'customersFactory', 'connectionFactory', 'agentsFactory', 'paymentsFactory', 
    function($scope, $routeParams, lookupFactory, customersFactory, connectionFactory, agentsFactory, paymentsFactory){
      $scope.customerId  = $routeParams.id;
      $scope.heading  = "Add a New  Customer";
      $scope.customer = {};
      $scope.connection = {'active' : true, 'paymentdueon': 5, 'advanceamt':500, 'subscriptionamt':120};
      $scope.showModal = false;
      $scope.modalHeading = "";
      $scope.displayConnections = false;
      
      /** reusable functions **/
      
      function getConnections(){
        connectionFactory.getAllConnectionsForCustomer($scope.customer.uniqcustid).then(function(res){
          $scope.connections = res.data;
        }, function(err){
          console.log('Error in getting the connections for a customer');
        });
      }

      function refreshConnections(){
        $scope.toggleModal("");
        getConnections();
      }
      /** reusable functions **/
     
      $scope.openCal = function($event, flag) {
        if(flag =='dobstatus') $scope.dobStatus.opened = true;
        if(flag =='pfmstatus') $scope.pfmStatus.opened = true;
      };
      $scope.dobStatus = { opened: false };
      $scope.pfmStatus = { opened: false };
      if  ($scope.customerId !=  0)  {
        $scope.heading  = "Edit Customer";
        
        $scope.displayConnections = true;
        customersFactory.getCustomer($scope.customerId).then(function(res){
          $scope.customer = res.data;
          $scope.customer.dateofbirth = new Date($scope.customer.dateofbirth);
          getConnections();
        }, function(err){
          console.log("Error in finding customer data for Id : "+$scope.customerId + ".Error: "+err.message);
        });
      }


      $scope.saveCustomer = function(){
        if($scope.customerId != 0){
          customersFactory.updateCustomer($scope.customer).then(function(res){
          });
        } else {
          customersFactory.saveCustomerDetails($scope.customer).then(function(res){
            $scope.customerId = res.data._id;
            $scope.displayConnections = true;
          });
        }
      };

      $scope.toggleModal = function(heading, connection){
         $scope.showModal = !$scope.showModal;
         $scope.modalHeading = heading;
         if (typeof connection != "undefined") {
            $scope.connection = connection;
            $scope.payment = {'connectionId' : connection._id, 'paidamt' : connection.subscriptionamt, 'type' : 'Subscription'};
            $scope.payments = connection.payments;
            
         }
         else {
            $scope.connection.address = $scope.customer.address;
         }
      }

      $scope.resetAddress = function(){
        $scope.connection.address = {};
      }
      $scope.saveConnectionDetails = function(){
        $scope.connection.customerid = $scope.customer.uniqcustid;
        if(typeof $scope.connection._id != 'undefined'){
          connectionFactory.updateConnection($scope.connection).then(function(res){
            refreshConnections();
          });
        } else {
          connectionFactory.saveConnectionDetails($scope.connection).then(function(res){
            refreshConnections();
          });
        }
      };
      agentsFactory.getAgents().then(function(res){
        $scope.agents = res.data;
      })


      $scope.savePayment = function(){

        paymentsFactory.addPayment($scope.payment).then(function(res){
          refreshConnections();
        });
      }
      
  }])
  .controller('AgentCtrl', ['$scope', 'agentsFactory', function($scope, agentsFactory) {
      agentsFactory.getAgents().then(function(res){
        $scope.agents = res.data;
      })
  }])
  .controller('AddEditAgentCtrl', ['$scope', '$routeParams', 'lookupFactory', 'agentsFactory', function($scope, $routeParams, lookupFactory, agentsFactory){
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
      if($scope.agentId == 0){
        agentsFactory.addAgent($scope.agent).then(function(res){

        })
      } else {
        agentsFactory.updateAgent($scope.agent).then(function(res){

        })
      }
    }
  }])
  .controller('ReportsCtrl', ['$scope', function($scope) {

  }]);
