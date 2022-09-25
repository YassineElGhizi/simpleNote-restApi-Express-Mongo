const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    }, password: {
        type: String, required: true
    }, token: {type: String, default: ''}, notes: []
})


mongoose.set('toJSON', {
    virtuals: true, transform: (doc, converted) => {
        delete converted._id;
    }
})
module.exports = mongoose.model("User", userSchema)