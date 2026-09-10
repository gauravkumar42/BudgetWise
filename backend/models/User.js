const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.email ? this.email.split("@")[0] : "User";
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    currency: {
      type: String,
      default: "INR",
    },
    monthlyIncomeGoal: {
      type: Number,
      default: 0,
    },
    avatarColor: {
      type: String,
      default: function () {
        const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#0EA5E9", "#8B5CF6"];
        return colors[Math.floor(Math.random() * colors.length)];
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
