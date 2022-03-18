let async = require("async");
let Item = require("../models/item");
let Category = require("../models/category");
let ItemInstance = require("../models/iteminstance");

const { body, validationResult } = require("express-validator");

// display site index

exports.index = function (req, res, next) {
  async.parallel(
    {
      category_count: function (callback) {
        Category.countDocuments({}, callback); // pass empty object as match condition to find all documents of this collection
      },
      item_count: function (callback) {
        Item.countDocuments({}, callback);
      },
      item_instance_count: function (callback) {
        ItemInstance.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Adidas Inventory Home",
        error: err,
        data: results,
      });
    }
  );
};

// display all items
exports.item_list = function (req, res, next) {
  Item.find({})
    .sort({ name: 1 })
    .exec(function (err, list_items) {
      if (err) return next(err);
      res.render("item_list", { title: "Item List", item_list: list_items });
    });
};

// display item detail page
exports.item_detail = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      item_instance: function (callback) {
        ItemInstance.find({ item: req.params.id })
          .populate("item")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.item == null) {
        // no result
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_detail", {
        title: results.item.name,
        item: results.item,
        item_instances: results.item_instance,
      });
    }
  );
};

// display item create form
exports.item_create_get = function (req, res, next) {
  async.parallel(
    {
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render("item_form", {
        title: "Create Item",
        categories: results.categories,
      });
    }
  );
};

// handle item create
exports.item_create_post = [
  // convert category to array
  (req, res, next) => {
    if (!req.body.category instanceof Array) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  // validate and sanitize
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(), // use wildcard * tag to individually validate each of the genre array entries
  body("price", "Price must be specified")
    .trim()
    .isLength({ min: 0 })
    .toFloat()
    .escape(),

  // process request after validation and sanitization
  (req, res, next) => {
    // extract the validation errors from request
    const errors = validationResult(req);
    // create item object with escaped and trimmed data
    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      // there are errors
      // get all categories
      async.parallel(
        {
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          // mark user selected categories as checked
          for (let i = 0; i < results.categories.length; i++) {
            if (item.category.indexOf(results.categories[i]._id) > -1) {
              // set category to checked
              results.categories[i].checked = "true";
            }
          }
          res.render("item_form", {
            title: "Create Item",
            item: item,
            categories: results.categories,
            errors: errors.array(),
          });
          return;
        }
      );
    } else {
      // data from form is valid
      item.save(function (err) {
        if (err) return next(err);
        // successful - redirect to new item record
        res.redirect(item.url);
      });
    }
  },
];

// display item delete form
exports.item_delete_get = function (req, res, next) {
  async.parallel(
    {
      // find item and item instances
      item: function (callback) {
        Item.findById(req.params.id).exec(callback);
      },
      iteminstances: function (callback) {
        ItemInstance.find({ item: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.item == null) {
        // item not found
        res.redirect("/inventory/items");
      }
      // success, render confirmation page
      res.render("item_delete", {
        title: "Delete Item",
        item: results.item,
        iteminstances: results.iteminstances,
      });
    }
  );
};

// handle item delete
exports.item_delete_post = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.body.itemid).exec(callback);
      },
      iteminstances: function (callback) {
        ItemInstance.find({ item: req.params.itemid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      // success
      if (results.iteminstances.length > 0) {
        // item has instances - render form again
        res.render("item_delete", {
          title: "Delete Item",
          item: results.item,
          iteminstances: results.iteminstances,
        });
        return;
      } else {
        // item has no instances - free to delete object
        Item.findByIdAndDelete(req.body.itemid, function deleteItem(err) {
          if (err) return next(err);
          // success - redirect to items list
          res.redirect("/inventory/items");
        });
      }
    }
  );
};

// display item update form
exports.item_update_get = function (req, res, next) {
  // get item and categories
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).populate("category").exec(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.item == null) {
        // item not found
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // success
      // mark selected categories as checked
      for (
        let all_c_iter = 0;
        all_c_iter < results.categories.length;
        all_c_iter++
      ) {
        for (
          let item_c_iter = 0;
          item_c_iter < results.item.category.length;
          item_c_iter++
        ) {
          if (
            results.categories[all_c_iter]._id.toString() ===
            results.item.category[item_c_iter]._id.toString()
          ) {
            results.categories[all_c_iter].checked = "true";
          }
        }
      }
      // render item form
      res.render("item_form", {
        title: "Update Item",
        item: results.item,
        categories: results.categories,
      });
    }
  );
};

// handle item update
exports.item_update_post = [
  // convert category to array
  (req, res, next) => {
    if (!req.body.category instanceof Array) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },
  // validate and sanitize fields
  body("name", "Name must be specified").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(), // use wildcard * tag to individually validate each of the genre array entries
  body("price", "Price must be specified")
    .trim()
    .isLength({ min: 0 })
    .toFloat()
    .escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req);
    // create a item object with escaped / trimmed data and old id
    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      _id: req.params.id, // REQUIRED TO ASSIGN UPDATED OBJECT SAME ID AS PREVIOUS ITEM OBJECT
    });
    if (!errors.isEmpty()) {
      // there are errors
      // get item and categories
      async.parallel(
        {
          item: function (callback) {
            Item.findById(req.params.id).populate("category").exec(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          // mark selected categories as checked
          for (let i = 0; i < results.categories.length; i++) {
            if (item.category.indexOf(results.categories[i]._id) > -1) {
              // set category to checked
              results.categories[i].checked = "true";
            }
          }
          // render item form
          res.render("item_form", {
            title: "Update Item",
            item: results.item,
            categories: results.categories,
          });
        }
      );
    } else {
      // data from form is valid - update the record
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) return next(err);
        // success - redirect to item detail page
        res.redirect(theitem.url);
      });
    }
  },
];
