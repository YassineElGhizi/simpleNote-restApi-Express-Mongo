const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true
    }, password: {
        type: String, required: true
    }, token: {type: String, default: ''}, // notes: [{
    //     type: Schema.Types.ObjectId, ref: "Note"
    // }]
    notes: []
})

module.exports = mongoose.model("User", userSchema)