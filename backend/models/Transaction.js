const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "NetBanking", "Other"],
      default: "UPI",
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
