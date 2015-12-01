var async = require('async');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cable');
var db = mongoose.connection;

db.on('error', console.error);
/********Re usable functions**************/
function getMonthName(monthNumber) { //0 = January
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    return monthNames[monthNumber];
}

	
/**********************/
db.once('open', function() {
  	var CableSchemas = require('./models/customer.js');
	var Customer = CableSchemas.Customer;
	var CConnection = CableSchemas.CConnection;
	var Payment = CableSchemas.Payment;
	var statusTobeUpdated = [];
	var amountToBeUpdated = [];
	var currentYear = new Date().getFullYear();
    var previousMonth = getMonthName(new Date().getMonth() -1);
    var allCustomersVerified = false;
	Customer.find({active : true}, function(err, customers){
		if (err) console.log('Error in getting customer data');
		else {
			//loop through customers to find connections for each customer
			var checkPayment = function(connection){
	      		var subscriptionAmt = connection.subscriptionamt;
	      		var duedate = connection.conpaymentdate;
	            //console.log("Customer "+ connection.customerid +" is to pay "+subscriptionAmt+" by "+ duedate+ " of this month for connection"+ connection._id);
	            var currentDate = new Date();
	            var lastDateofMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
	            
	            if(lastDateofMonth.getDate() == currentDate.getDate()){
	            	amountToBeUpdated.push({'customerId': connection.customerid, 'connectionId': connection._id});
	            }
	            else if(new Date().getDate() >= duedate){
	            	var payments = connection.payments;
	                if(payments.length == 0){
	                	statusTobeUpdated.push({'customerId': connection.customerid, 'connectionId': connection._id, 'amt': connection.subscriptionamt});
					} else {
	                    Payment.find({_id: {$in: payments}, paidyear: currentYear, paidmonth: previousMonth}, function(err, payments){
	                        if(err) console.log('Error in getting payment', err, err.stack.split('\n'));
	                        else {
	                	        if(payments.length == 0){
	                                statusTobeUpdated.push({'customerId': connection.customerid, 'connectionId': connection._id, 'amt': connection.subscriptionamt});
	                            }
	                        }
	                    });
	                }
	            }
			}
			async.each(customers, function(customer, callback){
				//console.log('looping through customers : '+ customer.uniqcustid);
				async.each(customer.connections, function(connection, callback2){
					checkPayment(connection);
					callback2();
				});
				callback();
			});
			var updateAmoutDue = function(currentDate){
				async.each(amountToBeUpdated, function(amtobj, callback4){
					Customer.findOne({'uniqcustid': amtobj.customerId}, function(err, customer){
						var connection = customer.connections.id(amtobj.connectionId);
						var currentAmtDue = (typeof connection.amountdue != "undefined") ? connection.amountdue : 0;
						var amountDue = connection.subscriptionamt;
						var currentDate = new Date();
						if(connection.connectionstartdate.getMonth == new Date().getMonth 
								&& connection.connectionstartdate.getFullYear() == new Date().getFullYear()){
							var lastDateofMonth = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate();
							amountDue = (lastDateofMonth - currentDate.getDate()) * (amountDue / 30);
						}

						connection.amountdue = currentAmtDue + amountDue;
						currentAmtDue = (typeof customer.paymentdue != "undefined") ? customer.paymentdue : 0;
						customer.paymentdue = currentAmtDue + amountDue;
						
						customer.save(function(err, customer){
							if(err) console.log('Error in updating payment details', err, err.stack.split('\n'));
							else
								callback4();

						});
					});
				});
			}
			var updateCustomers = function(){
				async.each(statusTobeUpdated, function(updaterObj , callback3){
					Customer.findOne({'uniqcustid': updaterObj.customerId}, function(err, customer){
						var connection = customer.connections.id(updaterObj.connectionId);
						var paymentstatus = (connection.paymentstatus == 'Pending')? 'Defaulter' : 'Pending';
						connection.paymentstatus = paymentstatus;
						customer.paymentstatus = paymentstatus;
						customer.save(function(err, customer){
							if(err) console.log('Error in updating payment details', err, err.stack.split('\n'));
							else
								callback3();

						});
					})
				});
			}
			console.log('Updating customers with amount due details');
			
			updateAmoutDue();
			console.log('Updating customers with payment status');
			updateCustomers();

			process.exit();
		}


	});
		
});

