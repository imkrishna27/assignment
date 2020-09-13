const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/users');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
const { check, validationResult } = require('express-validator');
const { route } = require('./users');

// @route GET api/auth
// @desc TEST route
// @access Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/auth
// @desc login
// @access Public

router.post(
  '/',
  [
    check('email', 'Enter valid E-mail').isEmail(),
    check('password', 'Password Required').exists(),
    // check('admin','Error').isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, admin } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: ' Wrong Email' }] });
      }
      console.log(user);
      const isAdmin = user.admin;
      // console.log(isAdmin)

      if (isAdmin !== admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ errors: [{ msg: 'Wrong Password!' }] });
      }

      // const isAdmin = await User.findOne({ admin });
      // if(isAdmin === false){
      //   console.log("login as user");
      //   return res.json({'message':'logged as user'});
      // }

      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          if (isAdmin == true) {
            res.json({ token: token, msg: 'logged in as admin' });
          } else {
            res.json({ token: token, msg: 'logged in as user' });
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
