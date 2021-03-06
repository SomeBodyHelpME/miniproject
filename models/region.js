const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Region = new Schema({
    properties: {
        adm_nm: { type: String, required: true } // regionFullName
    },
    geometry: {
        coordinates: { type: [Number], index: '2dsphere' }
    }
}, {
        collection:
            'region'
    }
)

Region.statics.findNear = function (longitude, latitude) {
    return this.findOne({
        geometry: {
            $near: {
                $maxDistance: 0,
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            }
        }
    })
        .then(result => {
            if (!result) {
                return null;
            }
            return result.properties.adm_nm;
        });
}

Region.statics.findAllByRegionName = function (regionName) {
    return this.find({
        "properties.adm_nm": RegExp(regionName)
    })
}

Region.methods.toDto = function() {
    return {
        "id": this._id,
        "regionName": this.properties.adm_nm
    }
}
module.exports = mongoose.model('region', Region)