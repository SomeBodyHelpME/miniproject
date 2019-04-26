var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const dustSchema = new Schema({
	MSRDT: String,
	MSRSTE_NM: String,
	NO2: Number,
	O3: Number,
	CO: Number,
	SO2: Number,
	PM10: Number,
	PM25: Number
});

dustSchema.statics.search = function (regionName) {
	return this.findOne({ $text: { $search: regionName } }, null, {
		sort: { MSRDT: -1 }
	});
}

dustSchema.index({ "MSRSTE_NM": "text" })

module.exports = mongoose.model('dusts', dustSchema);