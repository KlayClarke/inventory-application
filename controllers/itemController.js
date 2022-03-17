let async = require("async");
let Item = require("../models/item");
const { body, validationResult } = require("express-validator");

// display all items
exports.item_list = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM LIST");
};

// display item detail page
exports.item_detail = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM DETAIL");
};

// display item create form
exports.item_create_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM CREATE GET");
};

// handle item create
exports.item_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM CREATE POST");
};

// display item delete form
exports.item_delete_form = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM DELETE GET");
};

// handle item delete
exports.item_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM DELETE POST");
};

// display item update form
exports.item_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM UPDATE GET");
};

// handle item update
exports.item_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM UPDATE POST");
};
