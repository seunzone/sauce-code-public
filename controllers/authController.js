import passport from 'passport';

exports.adminAuth = passport.authenticate('local', {
    successRedirect: '/admin-page',
    failureRedirect: '/admin'
}), (req, res) => {
};

exports.userAuth = passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login'
}), (req, res) => {
};
