const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');

const UserService = require('../user/userService');
const userService = new UserService();

// register
router.post('/register', [
  body('first_name', 'Please enter valid first name').isString().notEmpty(),
  body('last_name', 'Please enter valid last name').isString().notEmpty(),
  body('is_admin', "Please select valid user type").isBoolean().not().isString(),
  body('email', 'Please enter valid email').trim().isEmail(),
  body('password', 'Please enter valid password(Min. 6 characters.)').isString().trim().isLength({ min: 6 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var err_array = errors.array();
    res.status(422).send(
      {
        status: 422,
        err_msg: err_array[0].msg
      });
  } else {
    userService
      .register_u(req.body)
      .then(() => res.status(200).send(
        {
          status: 200,
          data: "You have been registered successfully! Please check your email and verify."
        }
      ))
      .catch(err => res.status(400).send(
        {
          status: 400,
          err_msg: err.message
        }
      ));


  }
});

// registration confirmation
router.get('/confirmation/:email/:token', (req, res) => {
  userService
    .confirm_user(req.params.email, req.params.token)
    .then((data) => res.status(200).send(
      {
        status: 200,
        data: data
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err_msg: err.message
      }
    ));
});

// user login
router.post('/login', async (req, res) => {
  var user_data = await userService.findByEmail(req.body.email);

  if (!user_data) {
    return res.send(
      {
        status: 404,
        err_msg: 'User does not exists'
      }
    )
  }

  if (!user_data.is_verified) {
    return res.status(400).send(
      {
        status: 400,
        err_msg: 'You are not verified user of the system. Please check your email or contact admin for the verification'
      }
    )
  }

  passport.authenticate('user-local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).send(
        err ? err.message :
          {
            status: 401,
            err_msg: 'email or password is incorrect'
          },
      );
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      const token = jwt.sign(user, config.get('auth.jwt.secret'), { expiresIn: config.get('auth.jwt.expiresIn') });
      return res.send({
        status: 200,
        data: {
          token, user: user_data
        }
      });
    });
  })(req, res);
});

module.exports = router;
