const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Mask = new Schema({
    user_id: { type: String, required: true },
    status: { type: String, enum: ['ON', 'OFF'], required: true },
    at: { type: Date, default: Date.now, required: true }
}, {
        collection:
            'mask'
    }
)

Mask.statics.create = function (id, status) {
    return new this({ user_id: id, 'status': status, at: Date.now() }).save()
}

module.exports = mongoose.model('mask', Mask)