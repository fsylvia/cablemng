var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var LookupType = require('../models/lookuptype.js');
var Lookup = require('../models/lookup.js');
var Customer = require('../models/customer.js');
var ConPayment = require('../models/connection.js');
var Connection = ConPayment.Connection;
var Payment = ConPayment.Payment;
var Agent = require('../models/agent.js');

/** reusable function starts**/
function handleError(err, result, res){

	if(!err){
		return res.send(result);
	}
	else {
		return res.send(500, err);
	}
}

function getUniqueId(flag, idproofno, dateofbirth, fathersname, name){
	var derivedCustId = "";
	if(idproofno) {
		var rndNo = Math.random();
		rndNo = rndNo.toPrecision(2) * 10000;
		derivedCustId = flag+rndNo + idproofno;
	}
	return derivedCustId;
}

function onBulkInsert(err, myDocuments) {
    if (err) {
        return next(err);
    }
    else {
        console.log('%count records were inserted!', myDocuments.length)
    }
}

function insertLookups(){
	Lookup.remove({}, function(err){
    	if(err) {
    		return handleError(err);
        }
    });
	var lookups = [
		        {'lookuptype': 'AREA', 'lookupvalue': 'Anthoniar Koil Street', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Valluvar St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Anna Nagar', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'VOC Theru', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Bharathi Theru', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'TVK St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Cheran St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Kennedy St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Kannagi St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Elango St', 'createddate': new Date(Date.now())},
				{'lookuptype': 'AREA', 'lookupvalue': 'Sangath St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Kalaivanar', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Madavi St', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Kaveri Nagar', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Kozhi pannai st', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Annai Ashram', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'AREA', 'lookupvalue': 'Wireless Rd', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Passport', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Ration Card', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Driving License', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Aadhar Card', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'ID_TYPE', 'lookupvalue': 'Voter ID', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Relocating town', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Repeat Defaulter', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Got DTH', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'REASON_FOR_DEACTIVATION', 'lookupvalue': 'Other reasons', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'TERMINATION_REASONS', 'lookupvalue': 'Not regular at work', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'TERMINATION_REASONS', 'lookupvalue': 'Indisciplined', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'TERMINATION_REASONS', 'lookupvalue': 'Other reasons', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'PAYMENT_TYPE', 'lookupvalue': 'Advance', 'createddate': new Date(Date.now())},
		        {'lookuptype': 'PAYMENT_TYPE', 'lookupvalue': 'Subscription', 'createddate': new Date(Date.now())}

		    ];
		    Lookup.collection.insert(lookups, function(err){
		    	if(err){
		    		console.log('Error in inserting lookups');
		    		return handleError(err);
		    	}
		    });
}
/** reusable function ends**/
/** api starts **/
router.get('/', function(req, res){
	res.send('Welcome to api zone');
});

router.get('/resetmongodb', function (req, res) {
    LookupType.remove({}, function (err) {
        if (err) {
            return handleError(err);
        } 
    });

    var lookupTypes = [
        {'lookuptype' : 'AREA', 'createddate' : new Date(Date.now())},
        {'lookuptype' : 'ID_TYPE', 'createddate' : new Date(Date.now())},
        {'lookuptype' : 'REASON_FOR_DEACTIVATION', 'createddate' : new Date(Date.now())}
    ];
    LookupType.collection.insert(lookupTypes, function(err){
    	if(err)
    		return handleError(err);
    });

    insertLookups();

    res.json({'jobStatus': 'MongoDB Refresh Complete - It\'s All Good!'});
});

router.get('/types', function(req, res){
	LookupType.find(function(err, lookuptypes){
		handleError(err, lookuptypes, res);
	});
});

router.post('/types/add', function(req, res){
	var lookuptype = new LookupType({
			lookuptype : req.body.type,
			active : true,
			createddate : new Date(Date.now())
	});
		
	lookuptype.save(function(err){
		handleError(err, lookuptype, res);
	})
});

router.get('/types/delete/:id', function(req, res){
	var id = req.params.id;
	LookupType.remove({_id: id}, function(err){
		handleError(err, "LookupType deactivated", res);
	});
});

router.get('/lookup', function(req, res){
	//var type = req.params.type; {lookuptype: type},
	Lookup.find( function(err, lookups){
		handleError(err, lookups, res);
	})
});

router.get('/lookup/:type', function(req, res){
	var type = req.params.type; 
	Lookup.find({lookuptype: type}, function(err, lookups){
		handleError(err, lookups, res);
	})
});

router.post('/lookup/add', function(req, res){
	var lookup = new Lookup({
		lookuptype: req.body.lookuptype,
		lookupvalue: req.body.lookupvalue,
		createddate: new Date(Date.now())
	});
	lookup.save(function(err){
		handleError(err, lookup, res);
	})
});

router.get('/lookup/delete/:id', function(req, res){
	var id = req.params.id;
	Lookup.remove({_id: id}, function(err){
		handleError(err, 'Lookup entry deleted', res);
	})
});

router.post('/customer/add', function(req, res){
	var derivedId = getUniqueId('CR',req.body.idproofno, req.body.dateofbirth, req.body.fathername, req.body.customername);
	
	var customer = new Customer({
		customername : req.body.customername,
		fathersname: req.body.fathersname,
		idprooftype: req.body.idprooftype,
		idproofno: req.body.idproofno,
		dateofbirth: req.body.dateofbirth,
		uniqcustid : derivedId,
		custstartdate : new Date(Date.now()), 
		active: true,
		paymentstatus : "",
		address : {
			street1 : req.body.address.street1,
			street2: req.body.address.street2,
			area: req.body.address.area,
			pincode: req.body.address.pincode
		},
		contacts : {
			landlineno : req.body.contacts.landlineno,
			mobileno : req.body.contacts.mobileno,
			email: req.body.contacts.email
		},
		createddate: new Date(Date.now())
	});
	customer.save(function(err){
		handleError(err, customer, res);
	});
});

router.post('/customer/edit', function(req, res){
	var customerId = req.body.customerId;
	var updateSet = {
		customername : req.body.customername,
		fathersname: req.body.fathersname,
		idprooftype: req.body.idprooftype,
		idproofno: req.body.idproofno,
		dateofbirth: req.body.dateofbirth,
		paymentstatus : "",
		address : {
			street1 : req.body.address.street1,
			street2: req.body.address.street2,
			area: req.body.address.area,
			pincode: req.body.address.pincode
		},
		contacts : {
			landlineno : req.body.contacts.landlineno,
			mobileno : req.body.contacts.mobileno,
			email: req.body.contacts.email
		},
		updateddate : new Date(Date.now())
	};
	
	Customer.findByIdAndUpdate(req.body._id, { $set: updateSet}).exec(function(err){
		handleError(err, "Customer updated successfully", res);
	});
});

router.get('/customer/:id', function(req, res){
	var customerId = req.params.id;
	Customer.findOne({_id: customerId}, function(err, customer){
		handleError(err,customer, res);
	})
});

router.get('/customer', function(req, res){
	Customer.find(function(err, customers){
		handleError(err, customers, res);
	})
});

router.post('/connection/add', function(req, res){
	var connection = new Connection({
		customerid : req.body.customerid,
		active : req.body.active,
		advanceamt : req.body.advanceamt,
		hasamp: req.body.hasamp,
		subscriptionamt : req.body.subscriptionamt,
		paymentdueon: req.body.paymentdueon,
		connectionstartdate: new Date(Date.now()),
		address : {
			street1 : req.body.address.street1,
			street2: req.body.address.street2,
			area: req.body.address.area,
			pincode: req.body.address.pincode
		},
		createddate: new Date(Date.now())
	
	});
	
	connection.save(function(err){
		if(err)
			handleError(err);
		/*Customer.findOne({uniqcustid: customerid}, function(err, customer){
			customer.connections.push(connection._id);
			customer.save(function(err, connection, res){
				handleError(err, connection, res);	
			});
		});*/
	});
});

router.post('/connection/update', function(req, res){
	var rmFromCustomer = false;
	var updateSet = {
		advanceamt : req.body.advanceamt,
		hasamp: req.body.hasamp,
		subscriptionamt : req.body.subscriptionamt,
		paymentdueon: req.body.paymentdueon,
		active : req.body.active,
		address : {
			street1 : req.body.address.street1,
			street2: req.body.address.street2,
			area: req.body.address.area,
			pincode: req.body.address.pincode
		},
		updateddate : new Date(Date.now())
	};
	if(!req.body.active){
		updateSet['deacitvationreason'] = req.body.deacitvationreason;
		updateSet['deacitvationdate'] = new Date(Date.now());
		rmFromCustomer = true;
	}
	if(req.body.exempt){
		updateSet['exemptionreason'] = req.body.exemptionreason;
		updateSet['exemptiontill'] = req.body.exemptiontill;
	}
	
	Connection.findByIdAndUpdate(req.body._id, { $set: updateSet}, function (err, connection) {
  		if (err) return handleError(err);
  		/*if(rmFromCustomer) {
  			Customer.findOne({uniqcustid: req.body.customerId}, function(err, customer){
  				if(err) handleError(err);
  				var index = customer.connections.indexOf(connection._id);
  				if(index >= 0) {
  					customer.connections.splice(index, 1);
  					customer.save(function (err){
  						if(err) handleError(err);
  					});
  				}
  			});
  		}*/
  			
  		res.send(connection);
  		
	});
});	

router.get('/connection/:customerid', function(req, res){
	var customerId = req.params.customerid;
	
	Connection.find({customerid: customerId})
	.populate('payments')
	.exec(function(err, connections){
		handleError(err, connections, res);
	});
});

router.get('/agents', function(req,res){
	Agent.find(function(err, agents){
		handleError(err, agents, res);
	});
});

router.get('/agent/:agentid', function(req,res){
	var agentId = req.params.agentid;
	Agent.findOne({'_id': agentId},function(err, agent){
		handleError(err, agent, res);
	});
});

router.post('/agent/add', function(req, res){
	var agent = new Agent ({
		uniqagentid : getUniqueId('AT', req.body.idproofno),
		agentname: req.body.agentname,
		fathersname: req.body.fathersname,
		dateofbirth: req.body.dateofbirth,
		idprooftype: req.body.idprooftype,
		idproofno: req.body.idproofno, 
		address : {
			street1 : req.body.address.street1,
			street2: req.body.address.street2,
			area: req.body.address.area,
			pincode: req.body.address.pincode
		},
		contacts : {
			landlineno : req.body.contacts.landlineno,
			mobileno : req.body.contacts.mobileno,
			email: req.body.contacts.email
		},
		areallocated : req.body.areallocated,
		startdate: req.body.startdate,
		salary: req.body.salary,
		active: true,
		createddate: new Date(Date.now())
	});
	agent.save(function(err){
		handleError(err, agent, res);
	});
});

router.post('/agent/edit', function(req, res){
	var updateSet = {
		agentname: req.body.agentname,
		fathersname: req.body.fathersname,
		dateofbirth: req.body.dateofbirth,
		idprooftype: req.body.idprooftype,
		idproofno: req.body.idproofno, 
		address : {
			street1 : req.body.address.street1,
			street2: req.body.address.street2,
			area: req.body.address.area,
			pincode: req.body.address.pincode
		},
		contacts : {
			landlineno : req.body.contacts.landlineno,
			mobileno : req.body.contacts.mobileno,
			email: req.body.contacts.email
		},
		areallocated : req.body.areallocated,
		startdate: req.body.startdate,
		salary: req.body.salary,
		active: req.body.active,
		updateddate: new Date(Date.now())
	}
	
	Agent.findByIdAndUpdate(req.body._id, { $set: updateSet}).exec(function(err){
		handleError(err, "Agent updated successfully", res);
	});
});

router.post('/connection/payment/add', function(req, res){
	var connectionId = req.body.connectionId;
	var paidForMonth = req.body.paidForMonth;
	console.log(paidForMonth);
	var payment = new Payment({
		paidamt : req.body.paidamt,
		paiddate : new Date(Date.now()),
		paidformonth : req.body.paidformonth,
		paidto : req.body.paidto,
		paymenttype : req.body.type
	});
	console.log(payment);
	console.log(connectionId);
	payment.save(function(err){
		if(err)
			handleError(err);
		else {
			Connection.findOne({'_id': connectionId}, function(err, connection){
				if(err)
					handleError(err);
				else {
					connection.payments.push(payment);
					connection.save()
				}
			});
		}
	});
});


/** api ends **/

module.exports = router;