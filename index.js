const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

/* GET home page. */
router.get('/', (req, res, next) => {

  const successMsg = req.flash('success')[0];
  Product.find((err, docs) => {
    const productChunks = []; // empty array
    const chunkSize = 3;
    for (let i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize)); // push new item
    }
    res.render('shop/index', {
      title: 'NodeJs-Project',
      products: productChunks,
      successMsg,
      noMessages: !successMsg
    });
  });
});

router.get('/add-to-cart/:id', (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  // mongoDB
  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart; //storing this in my cart object in my session'
    console.log(req.session.cart);
    res.redirect('/');
  });
});

// - reduce
router.get('/reduce/:id', function (req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  // stor my session
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});
// + add
router.get('/add/:id', function (req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.addByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

// remove All items from shopping cart.
router.get('/remove/:id', function (req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});



router.get('/shopping-cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {
      products: null
    });
  }



  const cart = new Cart(req.session.cart);
  return res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });

});

router.get('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];// flash into an error object in the first element in the array.
  res.render('shop/checkout', {
    total: cart.totalPrice, 
    errMsg, 
    noErrors: !errMsg
  });
});
// isLoggedIn 
router.post('/checkout', isLoggedIn, (req, res, next) => {
    if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const stripe = require("stripe")("sk_test_gDDz7QDVjOphU3MEfgOJfguL00goaXfFsa");

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "sek",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Charge for test@test.com"
  }, (err, charge) => {
    // asynchronously called
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    // creat new order and saved in the database
    const order = new Order({
      user: req.user,// get the user
      cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    // saved to database with order.save()
    order.save((err, result) => {

    req.flash('success', 'Successfully bought product');
    req.session.cart = null; // to empty the cart
    res.redirect('/');// go back to 
    });
  });

});

module.exports = router;

  // for Middleware

  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url; // set equel to the URL try to access - stored the old URL
    res.redirect('/user/signin');// to go to signin page
}