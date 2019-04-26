const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Mask = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['ON', 'OFF'], required: true },
    at: { type: Date, default: Date.now, required: true }
}, {
        collection:
            'mask'
    }
)

Mask.statics.create = function (user, status) {
    return new this({ user, 'status': status, at: Date.now() }).save()
}

Mask.statics.findMaskStatusByUserId = function (id) {
    return this.findOne({ user_id: id }, null, { sort: { at: -1 } })
}
module.exports = mongoose.model('mask', Mask)