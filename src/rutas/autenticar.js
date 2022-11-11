const express = require('express');
const router = express.Router();

const passport = require('passport');

const pool = require('../database');

router.get('/login', (req, res) => {
    res.render('../vistas/autenticar/login');
});
router.post('/login', async(req, res) => {
    passport.authenticate('local.login', {
        successRedirect: '/links/inventarios',
        failureRedirect: '/login',
        failureFlash: true
    });
});


module.exports = router;