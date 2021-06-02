const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('config');
const logger = require('./utils/logger');
var path = require('path');

require('./passport');

// common controllers
const authController = require('./api/common/auth/authController');
const userController = require('./api/common/user/userController');
const productController = require('./api/common/product/productController');
const productReviewController = require('./api/common/productReview/productReviewController');

const SeedService = require('./api/seedService');
const seedService = new SeedService();

const app = express();
const { port, root } = config.get('api');

function logErrors(err, req, res, next) {
  logger.error(err);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Something went wrong.');
  } else {
    next(err);
  }
}

app.use(cors());
app.use(bodyParser.json());

const auth = passport.authenticate('jwt', { session: false });

// // seed data in case of empty data base
// seedService.checkAndSeed();

// routes for common controllers
app.use(`${root}/auth`, authController);
app.use(`${root}/users`, auth, userController);
app.use(`${root}/products`, auth, productController);
app.use(`${root}/product-review`, auth, productReviewController);

app.use(express.static(path.join(__dirname, '../src')));

app.use(logErrors);
app.use(clientErrorHandler);

app.get('/', (req, res) => {
  res.send('Products Backend!');
});

var http = require('http').Server(app);
http.listen(`${port}`, () => {
    console.log(new Date())
});
logger.info(`Server start listening port: ${port}`);
