const { ObjectID } = require('mongodb');
const ProductReviewRepository = require('./productReviewRepository');
const UserService = require('../user/userService');
const userService = new UserService();

const ProductService = require('../product/productService');
const productService = new ProductService();

class ProductReviewService {
  constructor() {
    this.repository = new ProductReviewRepository();
  }

  //save productReview
  async saveProductReview(req) {
    const user_data = await userService.findById(req.user.id);
    if (!user_data) throw new Error("Current user does not exist!");
    if (user_data.is_admin) throw new Error("Access denied!");
    const product_data = await productService.findById(req.body.product_id);
    if (!product_data) throw new Error("Selected product does not exist!");

    const newProductReview = {
      user_id: new ObjectID(req.user.id),
      product_id: new ObjectID(req.body.product_id),
      created_at: new Date()
    };
    return this.repository.add(newProductReview);
  }
  
}

module.exports = ProductReviewService;
