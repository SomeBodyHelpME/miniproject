var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dustSchema = new Schema({
	MSRDT : String,
	MSRSTE_NM : String,
	NO2 : Number,
	O3 : Number,
	CO : Number,
	SO2 : Number,
	PM10 : Number,
	PM25 : Number
});

module.exports = mongoose.model('dust', dustSchema);