let async = require("async");
let Category = require("../models/category");
let Item = require("../models/item");
const { body, validationResult } = require("express-validator");

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
  res.render("category_form", { title: "Create Category" });
};

// handle category create
exports.category_create_post = [
  // validate and sanitize the name field
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // create a category object with escaped and trimmed data
    let category = new Category({
      name: req.body.name,
    });
    if (!errors.isEmpty()) {
      // there are errors
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // data from form is valid
      // check if category of same name already exists
      Category.findOne({ name: req.body.name }).exec(function (
        err,
        found_category
      ) {
        if (err) return next(err);
        if (found_category) {
          // category of same name exists, redirect to its detail page
          res.redirect(found_category.url);
        } else {
          category.save(function (err) {
            if (err) return next(err);
            // category saved - redirect to category detail page
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

// display category delete form
exports.category_delete_get = function (req, res, next) {
  async.parallel(
    {
      // find category and corresponding items
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
        // category not found
        res.redirect("/inventory/categories");
      }
      // successful, render
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

// handle category delete
exports.category_delete_post = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      // success
      if (results.category_items.length > 0) {
        // category has items
        res.render("category_delete", {
          title: "Delete Category",
          category: results.category,
          category_items: results.category_items,
        });
        return;
      } else {
        // category has no items - free to delete object
        Category.findByIdAndDelete(
          req.body.categoryid,
          function deleteCategory(err) {
            if (err) return next(err);
            // success - go to category list
            res.redirect("/inventory/categories");
          }
        );
      }
    }
  );
};

// display category update form
exports.category_update_get = function (req, res, next) {
  // get category
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.category == null) {
        // category not found
        let err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // success
      // render category form
      res.render("category_form", {
        title: "Update Category",
        category: results.category,
      });
    }
  );
};

// handle category update
exports.category_update_post = [
  // validate and sanitize field
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract the validation errors from a request
    const errors = validationResult(req);
    // create a category object with escaped / trimmed data and old id
    let category = new Category({
      name: req.body.name,
      _id: req.params.id, // APPLY CURRENT CATEGORY OBJECT ID TO OBJECT
    });
    if (!errors.isEmpty()) {
      // there are errors
      // get category for form
      async.parallel(
        {
          category: function (callback) {
            Category.findById(req.params.id).exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          // success, render
          res.render("category_form", {
            title: "Update Category",
            category: results.category,
          });
        }
      );
      return;
    } else {
      // data from form is valid - update record
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, thecategory) {
          if (err) return next(err);
          // successful - redirect to category detail page
          res.redirect(thecategory.url);
        }
      );
    }
  },
];
