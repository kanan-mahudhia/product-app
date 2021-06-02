const ProductRepository = require('./productRepository');

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  // get all products
  list() {
    return this.repository.getAllProducts();
  }

  // get product by id
  findById(id) {
    return this.repository.findById(id)
      .then(product => product);
  }

  addMany(products) {
    return this.repository.addMany(products);
  }
}

module.exports = ProductService;
