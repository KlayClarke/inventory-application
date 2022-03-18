let async = require("async");
let ItemInstance = require("../models/iteminstance");
const { body, validationResult } = require("express-validator");

// display all iteminstances
exports.iteminstance_list = function (req, res, next) {
  ItemInstance.find()
    .populate("item")
    .exec(function (err, list_iteminstances) {
      if (err) return next(err);
      res.render("iteminstance_list", {
        title: "Item Instance List",
        iteminstance_list: list_iteminstances,
      });
    });
};

// display iteminstance detail page
exports.iteminstance_detail = function (req, res, next) {
  ItemInstance.findById(req.params.id)
    .populate("item")
    .exec(function (err, iteminstance) {
      if (err) return next(err);
      if (iteminstance == null) {
        // iteminstance not found
        let err = new Error();
        err.status = 404;
        return next(err);
      }
      res.render("iteminstance_detail", {
        title: "Item Instance Detail",
        iteminstance,
      });
    });
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
