const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const ProductReviewService = require('./productReviewService');
const productReviewService = new ProductReviewService();

// save product review
router.post('/', [
  body('product_id', 'Please select valid product').isMongoId(),
  body('ratings', 'Please enter valid ratings').notEmpty().isNumeric().not().isString(),
  body('review', 'Please enter review').isString().trim().notEmpty()
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
    productReviewService
      .saveProductReview(req)
      .then((result) => res.status(200).send(
        {
          status: 200,
          data: result
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

module.exports = router;
