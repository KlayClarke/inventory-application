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
  res.send("NOT IMPLEMENTED: ITEM CREATE GET");
};

// handle item create
exports.item_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: ITEM CREATE POST");
};

// display item delete form
exports.item_delete_get = function (req, res, next) {
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
