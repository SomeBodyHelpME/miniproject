const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  device_id: { type: String, required: true, unique: true },
  firebase_token: { type: String, required: true, unique: true },
  regions: [{ type: Schema.Types.ObjectId, ref: 'region', required: true }],
});

User.statics.create = function(deviceId, firebaseToken) {
  return new this({
    device_id: deviceId,
    firebase_token: firebaseToken,
    regions: []
  }).save();
};

User.methods.changeRegions = function(regionIds) {
    this.regions = regionIds;
    return this.save()
}


module.exports = mongoose.model('user', User);