const { ObjectID } = require('mongodb');

const BaseRepository = require('../../../db/baseRepository');

class ProductRepository extends BaseRepository {
  constructor() {
    super('cl_products');
  }
}

module.exports = ProductRepository;
