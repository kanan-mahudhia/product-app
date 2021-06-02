const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');

const DecodeService = require('../decodeService/decodeService');
const decodeService = new DecodeService();

const UserService = require('./userService');
const userService = new UserService();

const cipherHelper = require('../auth/cipherHelper');

router.get('/current', (req, res) => {
  userService
    .findById(req.user.id)
    .then(user => res.send(
      {
        status: 200,
        data: user
      }
    ))
    .catch(err => res.status(400).send(
      {
        status: 400,
        err: err.message
      }
    ));
});


module.exports = router;
