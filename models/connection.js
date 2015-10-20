var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Payment = new Schema({
	paidamt : Number,
	paiddate : Date,
	paidformonth : Date,
	paidto : String,
	paymenttype : String,
	connectionId : String
});
var Connection = new Schema({
	customerid : String,
	advanceamt : Number,
	hasamp: Boolean,
	subscriptionamt : Number,
	paymentdueon: Number,
	paymentstatus: {type: 'string', default: 'No Dues' },
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
		city: {type: 'string', default: 'Trichy' },
		pincode: Number
	},
	payments : [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
	createddate: Date,
	updateddate : Date
});
var Payment = mongoose.model('Payment', Payment);
var Connection = mongoose.model('Connection', Connection);
var ConPayment = {'Connection' : Connection, 'Payment': Payment};
module.exports = ConPayment;