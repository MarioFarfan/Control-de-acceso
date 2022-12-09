module.exports = {
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/login');
        }
    } ,

    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/home');
        }
    },

    isAdmin(req, res, next) {
        if(req.user.rol == 'Administrator'){
            return next();
        } else {
            req.flash('error', 'You must be an administrator');
            res.redirect('/home');
        }
    },

    isAux(req, res, next) {
        if(req.user.rol == 'Auxiliar'){
            return next();
        } else {
            req.flash('error', 'No tienes los privilegios necesarios, ingresa con un usuario diferente');
            res.redirect('/home');
        }
    }
};