let express = require("express");
let router = express.Router();

// require controller modules
let category_controller = require("../controllers/categoryController");
let item_controller = require("../controllers/itemController");
let item_instance_controller = require("../controllers/itemInstanceController");

// get inventory home page
router.get("/", item_controller.index);

// CATEGORY ROUTES //

// get request for creating a category
router.get("/category/create", category_controller.category_create_get);

// post request for creating a category
router.post("/category/create", category_controller.category_create_post);

// get request for deleting a category
router.get("/category/:id/delete", category_controller.category_delete_get);

// post request for deleting a category
router.post("/category/:id/delete", category_controller.category_delete_post);

// get request for updating a category
router.get("/category/:id/update", category_controller.category_update_get);

// post request for updating a category
router.post("/category/:id/update", category_controller.category_update_post);

// get request for category detail page
router.get("/category/:id", category_controller.category_detail);

// get request for list of all categories
router.get("/categories", category_controller.category_list);

// ITEM ROUTES //

// get request for creating an item
router.get("/item/create", item_controller.item_create_get);

// post request for creating an item
router.post("/item/create", item_controller.item_create_post);

// get request for deleting an item
router.get("/item/:id/delete", item_controller.item_delete_get);

// post request for deleting an item
router.post("/item/:id/delete", item_controller.item_delete_post);

// get request for updating an item
router.get("/item/:id/update", item_controller.item_update_get);

// post request for updating an item
router.post("/item/:id/update", item_controller.item_update_post);

// get request for item detail page
router.get("/item/:id", item_controller.item_detail);

// get request for list of items
router.get("/items", item_controller.item_list);

// ITEM INSTANCE ROUTES //

// get request for creating an item instance
router.get(
  "/iteminstance/create",
  item_instance_controller.iteminstance_create_get
);

// post request for creating an item instance
router.post(
  "/iteminstance/create",
  item_instance_controller.iteminstance_create_post
);

// get request for deleting an item instance
router.get(
  "/iteminstance/:id/delete",
  item_instance_controller.iteminstance_delete_get
);

// post request for deleting an item instance
router.post(
  "/iteminstance/:id/delete",
  item_instance_controller.iteminstance_delete_post
);

// get request for updating an item instance
router.get(
  "/iteminstance/:id/update",
  item_instance_controller.iteminstance_update_get
);

// post request for updating an item instance
router.post(
  "/iteminstance/:id/update",
  item_instance_controller.iteminstance_update_post
);

// get request for iteminstance detail page
router.get("/iteminstance/:id", item_instance_controller.iteminstance_detail);

// get request for list of iteminstances
router.get("/iteminstances", item_instance_controller.iteminstance_list);

module.exports = router;
