const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

router.get('/nueva_practica', isLoggedIn,  (req, res) => {
    res.render('agenda/nueva_practica')
});
module.exports = router;
