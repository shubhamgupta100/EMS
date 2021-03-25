var express = require('express');
var router = express.Router();
const User = require('../model/user');
const passport = require('passport')



// Get SignUp page
router.get('/signup',passport.setAuthenticatedUser, function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
}
  res.render('signup');
});

// Sign Up data
router.post('/signup', function (req, res) {
  var err;
  const { name, email, password, confirm_password, address, city } = req.body;
  if (!name || !email || !password || !address || !city) {
    err = "All Fields are required!"
    res.render('signup', { err: err });
  }
  if (password != confirm_password) {
    err = "Both password should be matched !"
    res.render('signup', { err: err });
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      User.create(req.body, (err, user) => {
        if (err) throw err;
        req.flash('success_message',"Registered Successfullt Login to continue!")
        return res.redirect('signin');
      })
    } else {
      return res.redirect('signup');
    }
  })

});

// Sign In Page
router.get('/signin', function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
}
  res.render('signin');
});

// Login
router.post('/create-session', passport.authenticate(
    'local',
    {
      failureRedirect: '/users/signin',
      successRedirect: '/',
    })
);

router.get('/logout' ,(req ,res)=> {
  req.logout();
  req.flash('success_message',"Logout Successfully Login to Continue !")
  return res.redirect('signin');
});

// module.exports.destroySession = function (req, res) {
  
// }

module.exports = router;
