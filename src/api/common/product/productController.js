const express = require('express');
const router = express.Router();
const csvtojson = require("csvtojson");
const multer = require("multer");

const f_path = require('config').get('file_path');

const UserService = require('../user/userService');
const userService = new UserService();

const ProductService = require('./productService');
const productService = new ProductService();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body);
    path = "./src/" + f_path + "/";
    const fs = require('fs');
    if (!fs.existsSync('./' + path)) {
      fs.mkdirSync('./' + path);
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let uploads = multer({
  storage: storage,
})

router.post('/upload-csv', uploads.single('csv'), async (req, res) => {
  const user_data = await userService.findById(req.user.id);
  if (!user_data) {
    return res.status(400).send(
      {
        status: 404,
        err: "Current user does not exist!"
      });
  };

  if (!user_data.is_admin) {
    return res.status(400).send(
      {
        status: 403,
        err: "Access denied!"
      });
  };

  var products = [];
  csvtojson()
    .fromFile(req.file.path)
    .then(csvData => {
      products = csvData;
      productService
        .addMany(products)
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
});


module.exports = router;
