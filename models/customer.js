var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Payment = new Schema({
	paidamt : Number,
	paiddate : Date,
	paidyear : Number,
	paidmonth : String,
	paidformonth : Date,
	paidto : String,
	paymenttype : String,
	connectionId : String
});
//combination and month and year to be unique
//Payment.index({ paidyear: 1, paidmonth: -1 }, { unique: true })
//db.payments.createIndex( { 'paidyear': 1, 'paidmonth': 1 }, { unique: true } )
var CConnection = new Schema({
	customerid : String,
	advanceamt : Number,
	hasamp: Boolean,
	subscriptionamt : Number,
	paymentmethod : String,
	conpaymentdate: Number,
	paymentstatus: {type: 'string', default: 'No Dues' },
	amountdue: Number,
	connectionstartdate: Date,
	unpaidmonth: Number,
	active: {type: 'boolean', default: 'true'},
	deacitvationreason: String,
	deacitvationdate: Date,
	exemptionreason: String,
	exemptiontill: Date,
	address : {
		street1 : String,
		street2: String,
		area: String,
		city: {type: 'string', default: 'Trichy' }
	},
	payments : [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
	createddate: Date,
	updateddate : Date
});

var Customer = new Schema({
	customername : String,
	fathersname: String,
	idprooftype: String,
	idproofno: String,
	dateofbirth: Date,
	uniqcustid : { type: 'string', unique: true },
	custstartdate : Date, 
	active: Boolean,
	paymentstatus : String,
	paymentdue: Number,
  	address : {
		street1 : String,
		street2: String,
		area: String,
		city: {type: 'string', default: 'Trichy' }
	},
	contacts : {
		landlineno : String,
		mobileno : String
	},
	connections : [CConnection],
	createddate: Date,
	updateddate : Date
});
var Customer = mongoose.model('Customer', Customer);
var Payment = mongoose.model('Payment', Payment);
var CConnection = mongoose.model('CConnection', CConnection);
var CableSchemas = {'Customer': Customer, 'CConnection' : CConnection, 'Payment': Payment};
module.exports = CableSchemas;

