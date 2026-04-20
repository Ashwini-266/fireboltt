const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userName: String,
    email: String,
    phone: Number,
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
  required: true,
},

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        title: String,
        quantity: Number,
        price: Number,
        gst:Number,
        gstAmount:Number
      },
    ],

    subtotal: Number,
    totalGST: Number, 
    totalAmount: Number,
     
    address: String,

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
    },

    upiId: String,
    paymentId: String,

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", OrderSchema);