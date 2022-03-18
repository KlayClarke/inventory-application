let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemInstanceSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
});

// virtual for iteminstance url
ItemInstanceSchema.virtual("url").get(function () {
  return `/inventory/iteminstance/${this._id}`;
});

// export iteminstance model
module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);
