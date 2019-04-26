var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var weatherSchema = new Schema({
	MSRDT: String,
	MSRSTE_NM: String,
	Humidity: Number,
	Temperatures: Number
});

weatherSchema.statics.search = function (regionName) {
	return this.findOne({ $text: { $search: regionName } }, null, {
		sort: { MSRDT: -1 }
	});
}

module.exports = mongoose.model('weather', weatherSchema);