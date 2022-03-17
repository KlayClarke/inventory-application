#! /usr/bin/env node

console.log(
  "This script populates some test items, iteminstances, and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var ItemInstance = require("./models/iteminstance");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var iteminstances = [];
var categories = [];

function categoryCreate(name, cb) {
  var category = new Category({ name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, category, price, cb) {
  var item = new Item({ name, description, category, price });

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function itemInstanceCreate(item, status, cb) {
  var iteminstance = new ItemInstance({ item, status });

  iteminstance.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item Instance: " + iteminstance);
    iteminstances.push(iteminstance);
    cb(null, iteminstance);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("Shoes", callback);
      },
      function (callback) {
        categoryCreate("Hoodies", callback);
      },
      function (callback) {
        categoryCreate("T-Shirts", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.series(
    [
      function (callback) {
        itemCreate(
          "YEEZY BOOST 700",
          "The 700 series of Kanye's legendary shoe",
          categories[0],
          300,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "YEEZY BOOST 350 V2 BONE",
          "The all white new addition to the Yeezy family",
          categories[0],
          230,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Donda Doves Hoodie",
          "Hoodie from the Donda Doves basketball merch collection",
          categories[1],
          120,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Donda Doves Shirt",
          "T-Shirt from the Donda Doves basketball merch collection",
          categories[2],
          80,
          callback
        );
      },
    ],
    //optional callback
    cb
  );
}

function createItemInstances(cb) {
  async.series(
    [
      function (callback) {
        itemInstanceCreate(items[0], callback);
      },
      function (callback) {
        itemInstanceCreate(items[0], callback);
      },
      function (callback) {
        itemInstanceCreate(items[0], callback);
      },
      function (callback) {
        itemInstanceCreate(items[0], callback);
      },
      function (callback) {
        itemInstanceCreate(items[0], callback);
      },
      function (callback) {
        itemInstanceCreate(items[0], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[1], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
      function (callback) {
        itemInstanceCreate(items[2], callback);
      },
    ], // optional callback
    cb
  );
}

async.series(
  [createCategories, createItems, createItemInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("ITEMInstances: " + iteminstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
