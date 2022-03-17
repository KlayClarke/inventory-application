let async = require("async");
let ItemInstance = require("../models/iteminstance");
const { body, validationResult } = require("express-validator");

// display all iteminstances
exports.iteminstance_list = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE LIST");
};

// display iteminstance detail page
exports.iteminstance_detail = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE DETAIL");
};

// display iteminstance create form
exports.iteminstance_create_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE CREATE GET");
};

// handle iteminstance create
exports.iteminstance_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE CREATE POST");
};

// display iteminstance delete form
exports.iteminstance_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE DELETE GET");
};

// handle iteminstance delete
exports.iteminstance_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE DELETE POST");
};

// display iteminstance update form
exports.iteminstance_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE UPDATE GET");
};

// handle iteminstance update
exports.iteminstance_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEMINSTANCE UPDATE POST");
};
