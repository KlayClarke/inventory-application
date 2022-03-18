let async = require("async");
let Category = require("../models/category");
let Item = require("../models/item");
const { body, validationResults } = require("express-validator");

// display all categories
exports.category_list = function (req, res, next) {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) return next(err);
      res.render("category_list", {
        title: "Category List",
        category_list: list_categories,
      });
    });
};

// display category detail page
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.category == null) {
        // if category does not exist in database
        let err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
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
