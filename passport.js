const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

// how to store the user in the session with the function.
passport.serializeUser((user, done) => {
    done(null, user.id);
    
}); 

// using mongoDB
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
       done(err, user); 
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, (req, email, password, done) => {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    const errors = req.validationErrors();
    if(errors){
        const messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, (err, user) => {
        if (err){
            return done(err);
        }
        if (user){
            return done(null, false, {message: 'Email / User is already in use.'});
        }
        // we need to create new user
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result) => {
            if (err){
                return done(err);
            }
            return done(null, newUser);
        });
        
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, (req, email, password, done) => {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        const messages = [];
        errors.forEach(error => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, (err, user) => {
        if (err){
            return done(err);
        }
        if (!user){// return error if didn't find the user 
            return done(null, false, {message: 'No user found.'});
        }
        if(!user.validPassword(password)){// if the password not valid
            return done(null, false, {message: 'Wrong password.'});
        }
            return done(null, user);
        });
    
}));
