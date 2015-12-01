var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Agent = new Schema({
	uniqagentid : { type: 'string', unique: true },
	agentname: String,
	fathersname: String,
	dateofbirth: Date,
	idprooftype: String,
	idproofno: String,
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
	areallocated : String,
	startdate: Date,
	salary: Number,
	active: Boolean,
	reasonfortermination: String,
	terminationdate: Date,
	createddate: Date,
	updateddate: Date
});
var Agent = mongoose.model('Agent', Agent);
module.exports = Agent;