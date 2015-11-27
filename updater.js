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
//solution: update amount due on last day of every month at EOD
//solution: update paymentstatus on convenient payment date EOD
//validate if connection start date check this
// conditions to check: job should not include values already verified and updated for this month.
// do not include customers who haverecdently started a connection and their payment amount is due only next month.
db.once('open', function() {
  	var CableSchemas = require('./models/customer.js');
	var Customer = CableSchemas.Customer;
	var CConnection = CableSchemas.CConnection;
	var Payment = CableSchemas.Payment;
	var tobeUpdated = [];
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
	            
	            if(new Date().getDate() >= duedate){
	            	var payments = connection.payments;
	                if(payments.length == 0){
	                	tobeUpdated.push({'customerId': connection.customerid, 'connectionId': connection._id, 'amt': connection.subscriptionamt});
					} else {
	                    Payment.find({_id: {$in: payments}, paidyear: currentYear, paidmonth: previousMonth}, function(err, payments){
	                        if(err) console.log('Error in getting payment', err, err.stack.split('\n'));
	                        else {
	                	        if(payments.length == 0){
	                                tobeUpdated.push({'customerId': connection.customerid, 'connectionId': connection._id, 'amt': connection.subscriptionamt});
	                            }
	                        }
	                    });
	                }
	            }
			}
			async.each(customers, function(customer, callback){
				//console.log('looping through customers : '+ customer.uniqcustid);
				
				async.each(customer.connections, function(connection, callback2){
					//console.log('looping through connections of customer with connection id: ', customer.uniqcustid, connection._id);
					checkPayment(connection);
					callback2();
				});
				callback();
			});
			var updateCustomers = function(){
				async.each(tobeUpdated, function(updaterObj , callback3){
					Customer.findOne({'uniqcustid': updaterObj.customerId}, function(err, customer){
						var connection = customer.connections.id(updaterObj.connectionId);
						var currentAmtDue = (typeof connection.amountdue != "undefined") ? connection.amountdue : 0;
						connection.amountdue = currentAmtDue + updaterObj.amt;
						currentAmtDue = (typeof customer.paymentdue != "undefined") ? customer.paymentdue : 0;
						customer.paymentdue = currentAmtDue + updaterObj.amt;
						connection.paymentstatus = 'Pending';
						customer.paymentstatus = 'Pending';
						customer.save(function(err, customer){
							if(err) console.log('Error in updating payment details', err, err.stack.split('\n'));
							else
								callback3();

						});
					})
				});
			}
			console.log('Update customers with pending payment details');
			updateCustomers(tobeUpdated);

		}


	});
		
});

