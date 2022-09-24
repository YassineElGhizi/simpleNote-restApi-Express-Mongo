const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/simplenote', {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', (error) => {
    console.log('Connection Failed with error : ', error)
})

db.on('open', () => {
    console.log("Connection established")
})

module.exports = db;