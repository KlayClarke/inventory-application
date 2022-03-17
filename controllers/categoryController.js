let async = require("async");
let Category = require("../models/category");
const { body, validationResults } = require("express-validator");

// display all categories
exports.category_list = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY LIST");
};

// display category detail page
exports.category_detail = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY DETAIL");
};

// display category create form
exports.category_create_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY CREATE GET");
};

// handle category create
exports.category_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY CREATE POST");
};

// display category delete form
exports.category_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY DELETE GET");
};

// handle category delete
exports.category_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY DELETE POST");
};

// display category update form
exports.category_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY UPDATE GET");
};

// handle category update
exports.category_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: CATEGORY UPDATE POST");
};
