const BaseRepository = require('../../../db/baseRepository');

class BlogRepository extends BaseRepository {
  constructor() {
    super('cl_product_reviews');
  }
}

module.exports = BlogRepository;
