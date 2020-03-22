var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = require('./keys').secretOrKey;
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        // console.log(jwt_payload);
        const user =  await User.findById(jwt_payload.id);
        // console.log(user);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }));
}