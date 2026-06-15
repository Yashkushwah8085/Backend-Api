import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCollection",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentMethod: {
      type: String,
      enum: [
        "upi",
        "card",
        "netbanking",
        "wallet"
      ],
      default: "upi",
    },

    paymentDetails: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "failed",
      ],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Payment",
  paymentSchema
);