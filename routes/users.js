var express = require('express');
var router = express.Router();
const {body, validationResult} = require("express-validator");
const bcrypt = require('bcrypt');
const saltRounds = 10;
let userModel = require('../models/user')

router.post('/', body("name").isString(), body("password").isString(), async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    userModel.findOne({name: req.body.name}).count((err, count) => {
        if (count !== 0) return res.status(409).send({'status': 'User Already Exists'})

        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            bcrypt.hash(req.body.name, saltRounds, async function (err, hashed) {
                let u = new userModel({'name': req.body.name, 'password': hash, 'token': hashed})
                await u.save();
                res.status(201).send({
                    'name': req.body.name, 'token': hashed, 'notes': [], 'id': u.id
                });
            });
        });
    })
})

router.post('/login', body('name').isString(), body('password').isString(), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

    userModel.findOne({name: req.body.name}, (err, docs) => {
        if (docs == null) return res.status(409).send({'status': 'No User Can Be Found!'})

        bcrypt.compare(req.body.password, docs.password).then(function (result) {
            if (!result) return res.status(409).send({'status': 'Wrong Password !'})

            res.send({'name': docs.name, 'token': docs.token, 'notes': docs.notes, 'id': docs.id})
        });


    })
})


module.exports = router;
