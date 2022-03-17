let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemInstanceSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
  },
  due_back: { type: Date, default: Date.now() },
});

// virtual for iteminstance url
ItemInstanceSchema.virtual("url").get(function () {
  return `/inventory/iteminstance/${this._id}`;
});

// export iteminstance model
module.export = mongoose.model("ItemInstance", ItemInstanceSchema);
