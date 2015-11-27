'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1')
  .factory('customersFactory', ['$http', function($http){
      return {
        saveCustomerDetails : function (customer){
          console.log(customer._id);
          if(typeof customer._id == 'undefined')
            return $http.post('api/customer/add', customer);
          else
            return $http.post('api/customer/edit', customer);
        },

        getActiveCustomers : function(){
          return $http.get('api/customer');
        },

        getCustomer : function(id){
          return $http.get('api/customer/'+id);
        }
      };
  }])
  .factory('connectionFactory', ['$http', function($http){
    return {
      saveConnectionDetails : function(connection){
        if(typeof connection._id == 'undefined')
          return $http.post('api/connection/add', connection);
        else
          return $http.post('api/connection/update', connection);
      },

      getAllConnectionsForCustomer : function(customerId){
        return $http.get('api/connection/'+customerId);
      }
    };
  }])
  .factory('paymentsFactory', ['$http', function($http){
    return{
      addPayment : function(payment){
        return $http.post('api/connection/payment/add', payment);
      },

      getPayments : function(connection){
        return $http.post('api/payments', connection);
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
