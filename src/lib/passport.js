const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const pool = require('../database');


passport.use('local.login', new localStrategy({
    usernameField: 'numcontrol',
    passwordField: 'pass',
    passReqToCallback: true
}, async (req, numcontrol, pass, done) => {

    const newuser = {
        numcontrol,
        pass
    }

    console.log(req.body);
}));

//passport.serializeUser((user, done) =>{
//    
//});