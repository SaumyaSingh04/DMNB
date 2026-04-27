const { mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
  ],
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["Pending", "Cancelled", "Accepted", "Served"],
    required: true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["Online", "COD"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = { Orders };
