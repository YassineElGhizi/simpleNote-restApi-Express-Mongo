const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new mongoose.Schema({
    body: {
        type: String, required: true
    }
    , owner: {
        type: Schema.Types.ObjectId, ref: "User"
    }
})

module.exports = mongoose.model("Note", noteSchema)