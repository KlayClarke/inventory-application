let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
});

// virtual for category url
CategorySchema.virtual("url").get(function () {
  return `/inventory/category/${this._id}`;
});

// export category model
module.exports = mongoose.model("Category", CategorySchema);
