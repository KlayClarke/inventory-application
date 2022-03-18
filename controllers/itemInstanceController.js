let async = require("async");
let ItemInstance = require("../models/iteminstance");
let Item = require("../models/item");
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
  // find all items, execute function that returns items object
  Item.find({}).exec(function (err, items) {
    if (err) return next(err);
    // successful, render form
    res.render("iteminstance_form", {
      title: "Create Item Instance",
      item_list: items,
    });
  });
};

// handle iteminstance create
exports.iteminstance_create_post = [
  // sanitize and validate
  body("item", "Item must be specified").trim().isLength({ min: 1 }).escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req);
    // create a item instance object with escaped and trimmed data
    let iteminstance = new ItemInstance({
      item: req.body.item,
    });
    // check for errors
    if (!errors.isEmpty()) {
      // there are errors
      // find all items
      Item.find({}).exec(function (err, items) {
        if (err) return next(err);
        // success, render
        res.render("iteminstance_form", {
          title: "Create Item Instance",
          item_list: items,
        });
      });
      return;
    } else {
      // data from form is valid
      // save item instance and redirect user to newly created iteminstance url
      iteminstance.save(function (err) {
        if (err) return next(err);
        // successful - redirect to new record
        res.redirect(iteminstance.url);
      });
    }
  },
];

// display iteminstance delete form
exports.iteminstance_delete_get = function (req, res, next) {
  async.parallel(
    {
      // find item instance
      iteminstance: function (callback) {
        ItemInstance.findById(req.params.id).populate("item").exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      // successful, render
      res.render("iteminstance_delete", {
        title: "Delete Item Instance",
        iteminstance: results.iteminstance,
      });
    }
  );
};

// handle iteminstance delete
exports.iteminstance_delete_post = function (req, res, next) {
  async.parallel(
    {
      iteminstance: function (callback) {
        ItemInstance.findById(req.body.iteminstanceid).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      // success, delete object and
      ItemInstance.findByIdAndDelete(
        req.body.iteminstanceid,
        function deleteItemInstance(err) {
          if (err) return next(err);
          // success, go to list of item instances
          res.redirect("/inventory/iteminstances");
        }
      );
    }
  );
};

// display iteminstance update form
exports.iteminstance_update_get = function (req, res, next) {
  // get iteminstance and item
  async.parallel(
    {
      items: function (callback) {
        Item.find({}).exec(callback);
      },
      iteminstance: function (callback) {
        ItemInstance.findById(req.params.id).populate("item").exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.iteminstance == null) {
        // no results returned - iteminstance not found
        let err = new Error("Item Instance not found");
        err.status = 404;
        return next(err);
      }
      // success
      res.render("iteminstance_form", {
        title: "Update Item Instance",
        item_list: results.items,
        iteminstance: results.iteminstance,
      });
    }
  );
};

// handle iteminstance update
exports.iteminstance_update_post = [
  // validate and sanitize field
  body("item", "Item must be specified").trim().isLength({ min: 1 }).escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    // extract validation errors from request
    const errors = validationResult(req);
    // create a iteminstance object with escaped/trimmed data and old id
    let iteminstance = new ItemInstance({
      item: req.body.item,
      _id: req.params.id, // REQUIRED: OTHERWISE, NEW ID WOULD BE ASSIGNED TO UPDATED OBJECT
    });
    if (!errors.isEmpty()) {
      // there are errors
      // get item for form
      async.parallel(
        {
          iteminstance: function (callback) {
            ItemInstance.findById(req.params.id)
              .populate("item")
              .exec(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          // success - render form
          res.render("iteminstance_form", {
            title: "Update Item Instance",
            item: results.iteminstance.item,
          });
        }
      );
      return;
    } else {
      // data from form is valid - update record
      ItemInstance.findByIdAndUpdate(
        req.params.id,
        iteminstance,
        {},
        function (err, theiteminstance) {
          if (err) return next(err);
          // successful - redirect to iteminstance detail page
          res.redirect(theiteminstance.url);
        }
      );
    }
  },
];
