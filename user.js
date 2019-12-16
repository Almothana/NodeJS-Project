const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const Order = require('../models/order');
const Cart = require('../models/cart');

const csrfProtection = csrf();
router.use(csrfProtection);// all the routes included in this package should be protected by csrfProtection

router.get('/profile', isLoggedIn ,(req, res, next) => {
    Order.find({user: req.user}, (err, orders) => {
      if(err){
        return res.write('Error!!');
      }
      // get the cart from the order
      let cart;
      orders.forEach(order => {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render('user/profile', {orders});
    });
    
  });
  router.get('/logout', isLoggedIn ,(req, res, next) => {
    req.logOut();
    res.redirect('/');
  });

router.use('/', notLoggedIn, (req, res, next) => {
    next();
});

router.get('/signup', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0});
    
  });
  //Post to add the user and go back to home.
  
  router.post('/signup', passport.authenticate('local.signup', {
      failureRedirect: '/user/signup',
      failureFlash: true
  }), (req, res, next) => {
    if (req.session.oldUrl){
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);                   
    }else{
      res.redirect('/user/profile');
    }
  });
  
 
  router.get('/signin', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',// here if it successful login the next function will be run 
    failureFlash: true
  }), (req, res, next) => {
    if (req.session.oldUrl){
      const oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;// for cleared the session.oldUrl, we don't need to stor oldUrl here  // we don't want to redirect the user to checkout page forever
      res.redirect(oldUrl);  
    }else{
      res.redirect('/user/profile');
    }
  });

  module.exports = router;

  // for Middleware

  function isLoggedIn(req, res, next) {
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/');
  }

  function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}