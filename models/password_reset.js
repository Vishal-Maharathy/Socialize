const mongoose = require('mongoose')
const User = require('../models/sign_up')

const passResetSchema = mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resetlink: {
        type: String,
        default: "a"
    }
},{timestamps: true})

passResetSchema.index({createdAt: Date.now()},{expireAfterSeconds: 60});

const passReset = mongoose.model('passReset', passResetSchema);
module.exports = passReset