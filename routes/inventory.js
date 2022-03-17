let express = require("express");
let router = express.Router();

// require controller modules
let category_controller = require("../controllers/categoryController");
let item_controller = require("../controllers/itemController");
let item_instance_controller = require("../controllers/itemInstanceController");

// get inventory home page
router.get("/", item_controller.index);

// ITEM ROUTES //

// get request for creating an item
router.get("/item/create", item_controller.item_create_get);

// post request for creating an item
router.get("/item/create", item_controller.item_create_post);

// get request for deleting an item
router.get("/item/:id/delete", item_controller.item_delete_get);

// post request for deleting an item
router.get("/item/:id/delete", item_controller.item_delete_post);

// get request for updating an item
router.get("/item/:id/update", item_controller.item_update_get);

// post request for updating an item
router.get("/item/:id/update", item_controller.item_update_post);

// get request for one item
router.get("/item/:id", item_controller.item_detail);

// get request for list of items
router.get("/item/:id", item_controller.item_list);
