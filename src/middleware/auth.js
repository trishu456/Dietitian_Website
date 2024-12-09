const ensureAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    } else {
        res.redirect('/login.html');
    }
};

module.exports = ensureAuthenticated;
