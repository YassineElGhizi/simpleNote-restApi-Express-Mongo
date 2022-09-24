var express = require('express');
var router = express.Router();
const {body, validationResult} = require("express-validator");
let userModel = require('../models/user')
var mongoose = require('mongoose');


router.get('/', function (req, res, next) {
    res.send({'hello': 'world'})
})

router.post('/', body('id').isString(), body('body').isString(), function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    let note = {'id': mongoose.Types.ObjectId().toString(), 'body': req.body.body, 'created_at': Date.now()}
    userModel.findByIdAndUpdate(req.body.id, {$push: {notes: note}}, {new: true}, (err, result) => {
        if (err) res.send(err)

        res.send(result)
    })
})

router.put('/:note_id', body('note_id').isString(), body('body').isString(), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});


    userModel.find({"notes.id": "632f3bb574c71734cb7284c6"}, 'notes', (err, note) => {
        if (err) return res.status(400).json({'status': 'No Record Matches'})

        console.log('😁', note)
        res.send(note)
    })

// userModel.findById(req.params.user_id, 'notes', (err, user) => {
//     if (err || user === null) return res.status(400).json({'status': 'No Record Matches'})
//
//     res.send(user)
// })

})


module.exports = router;
