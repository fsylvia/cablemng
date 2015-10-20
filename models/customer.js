var mongoose = require('mongoose');
var Connection = require('./connection.js').Connection;
var Schema = mongoose.Schema;
var Customer = new Schema({
	customername : String,
	fathersname: String,
	idprooftype: String,
	idproofno: {type: 'string', unique: true },
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
		city: {type: 'string', default: 'Trichy' },
		pincode: Number
	},
	contacts : {
		landlineno : String,
		mobileno : String,
		email: String
	},
	connections : [String],
	createddate: Date,
	updateddate : Date
});
var Customer = mongoose.model('Customer', Customer);
module.exports = Customer;
