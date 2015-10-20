'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
  .factory('customersFactory', ['$http', function($http){
      return {
        saveCustomerDetails : function (customer){
          return $http.post('api/customer/add', customer);
        },

        getAllCustomers : function(){
          return $http.get('api/customer');
        },

        getCustomer : function(id){
          console.log('getDetails for : '+id);
          return $http.get('api/customer/'+id);
        },

        updateCustomer : function (customer){
          return $http.post('api/customer/edit', customer);
        }


      };
  }])
  .factory('connectionFactory', ['$http', function($http){
    return {
      saveConnectionDetails : function(connection){
        return $http.post('api/connection/add', connection);
      },

      getAllConnectionsForCustomer : function(customerId){
        return $http.get('api/connection/'+customerId);
      },

      updateConnection : function(connection){
        return $http.post('api/connection/update', connection);
      }
      

    };
  }])
  .factory('paymentsFactory', ['$http', function($http){
    return{
      addPayment : function(payment){
        return $http.post('api/connection/payment/add', payment);
      },

      getPayments : function(connectionId){
        return $http.get('api/connection/payment/'+connectionId);
      }
    }
  }])
  .factory('agentsFactory', ['$http', function($http){
    return {
      getAgents : function(){
        return $http.get('api/agents');
      },
      getAgentById : function(agentId){
        return $http.get('api/agent/'+agentId);
      },
      addAgent : function(agent){
        return $http.post('api/agent/add', agent);
      },
      updateAgent: function(agent){
        return $http.post('api/agent/edit', agent);
      }

    };
  }])
  .factory('lookupFactory', ['$http', function($http){
  	return {
  		saveLookupType : function (lookupType){
        return $http.post('api/types/add', lookupType);
  		},

  		saveLookup : function (lookup){
			   return $http.post('api/lookup/add', lookup);
  		},

      deleteLookupType : function(id){
        return $http.get('api/types/delete/'+id);
      },

      deleteLookup : function(id){
        return $http.get('api/lookup/delete/'+id);
      },

  		getLookupType : function () {
  			return $http.get('api/types');
  		},

  		getLookup : function(type){
        if(type)
          return $http.get('api/lookup/'+type);
  			return $http.get('api/lookup');
  		}
  	};
  }]);