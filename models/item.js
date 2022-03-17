let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  price: { type: Number, required: true },
});

// virtual for item url
ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

// export item model
module.exports = mongoose.model("Item", ItemSchema);
