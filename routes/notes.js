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
    userModel.findByIdAndUpdate(req.body.id, {$push: {notes: note}}, {
        fieebodylbodyds: {
            'id': 1, 'token': 1, 'notes': 1, 'name': 1
        }, new: true
    }, (err, result) => {
        if (err) res.send(err)
        res.send(result)
    })
})

router.put('/:note_id', body('body').isString(), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    userModel.findOne({"notes.id": req.params.note_id}, 'notes', async (err, user) => {
        if (err) return res.status(400).json({'status': 'No Record Matches'})
        if (user === null) return res.status(400).json({'status': 'No Record Matches'})

        const newNotes = user.notes.map(note => {
            if (note.id === req.params.note_id) return {...note, body: req.body.body}
            return note;
        })

        userModel.findOneAndUpdate({"notes.id": req.params.note_id}, {$set: {notes: newNotes}}, {
            fields: {
                'id': 1, 'token': 1, 'notes': 1, 'name': 1
            }, new: true
        }, (err, result) => {
            if (err) res.send(err)
            res.send(result)
        })
    })
})

router.delete('/:note_id', async (req, res, next) => {
    userModel.findOne({"notes.id": req.params.note_id}, 'notes', async (err, user) => {
        if (err) return res.status(400).json({'status': 'No Record Matches'})
        if (user === null) return res.status(400).json({'status': 'No Record Matches'})

        const newNotes = user.notes.filter(function (obj) {
            return obj.id !== req.params.note_id;
        });

        userModel.findOneAndUpdate({"notes.id": req.params.note_id}, {$set: {notes: newNotes}}, {
            fields: {
                'id': 1, 'token': 1, 'notes': 1, 'name': 1
            }, new: true
        }, (err, result) => {
            if (err) res.send(err)
            res.send(result)
        })
    })
})

router.post('/search', body('keyword').isString(), body("user_id").isString(), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    userModel.findOne({"id": req.body.user_id}, 'notes', async (err, user) => {
        if (err) return res.status(400).json({'status': 'No Record Matches'})
        if (user === null) return res.status(400).json({'status': 'No Record Matches'})

        const newNotes = user.notes.filter(function (obj) {
            if (obj.body != null) return obj.body.includes(req.body.keyword);
        });

        res.send(newNotes)
    })
})


module.exports = router;
