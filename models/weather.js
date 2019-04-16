var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weatherSchema = new Schema({
	MSRDT : String,
	MSRSTE_NM : String,
	Humidity : Number,
	Temperatures : Number
});

module.exports = mongoose.model('weather', weatherSchema);