var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Lookup = new Schema({
	lookuptype: String,
	lookupvalue: String,
	createddate: Date
});
var Lookup = mongoose.model('Lookup', Lookup);
module.exports = Lookup;