var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cable');
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
  	var Customer = require('./models/customer.js');
	var ConPayment = require('./models/connection.js');
	var Connection = ConPayment.Connection;
	var Payment = ConPayment.Payment;
	var tobeUpdated = [];

	Customer.find({active : true}, function(err, customers){
		if (err) console.log('Error in getting customer data');
		else {
			function findConnections(i){
				console.log('findConnections loop index i: '+i);
				if(i < customers.length){
					var customerId = customers[i].uniqcustid;
					var start = new Date('2015', '8', '1');;
					var end = new Date('2015', '8', '30');
					Connection.find({customerid: customerId})
					.populate({path: 'payments', match: { 'paidformonth': { "$lt": end, "$gt": start}}})

					.exec(function(err, connections){
						if(err) console.log('Error in getting connection data');
						else {
							
							function checkPayment (j){
								if(j < connections.length){
									var connection = connections[j];
									var subscriptionAmt = connection.subscriptionamt;
									var duedate = connection.paymentdueon;
									console.log("Customer "+ connection.customerid +" is to pay "+subscriptionAmt+" by "+ duedate+ " of this month for connection"+ connection._id);
									var payments = connection.payments;
									if(payments.length == 0){
										tobeUpdated.push({'customerId': connection.customerid, 'amt': connection.subscriptionamt});
									}
									checkPayment(j+1);

								}
							}
							checkPayment(0);
							findConnections(i+1);
						}
					});
				}
				else{
					console.log(tobeUpdated);
					function updateCustomer(x){
						if(x<tobeUpdated.length){
							var updObj = tobeUpdated[x];
							Customer.update(
								{uniqcustid: updObj.customerId}, 
								{$set: {'paymentstatus': 'Not Paid', 'paymentdue': updObj.amt}},
								function(err){
									if(err) {
										console.log('Error in saving customer');
										erroredCust.push(tobeUpdated);
										updateCustomer(x+1);
									}
									else {
										console.log('Finished updating customer : '+updObj.customerId);
										updateCustomer(x+1);
									}
								}
							);
						}
					}
					updateCustomer(0);
				}
			}
			findConnections(0);
		}

	});
	
});

