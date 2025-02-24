const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  urlWatermark: {
    type: String,
    required: true,
  },
});

const itemModel = mongoose.model("Item", imgSchema);
module.exports = itemModel;
