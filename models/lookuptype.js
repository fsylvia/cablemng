var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LookupType = new Schema({
	lookuptype: String,
	createddate: Date,
	active: Boolean
});
var LookupType = mongoose.model('LookupType', LookupType);
module.exports = LookupType;