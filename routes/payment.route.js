import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";

import {
  createOrder,
  verifyPayment,
  paymentFailed,
  paymentHistory,
  paymentStats,
} from "../conroller/payment.controller.js";

const router = express.Router();

router.post(
  "/create-order",
  isAuthenticated,
  createOrder
);

router.post(
  "/verify-payment",
  isAuthenticated,
  verifyPayment
);

router.post(
  "/payment-failed",
  isAuthenticated,
  paymentFailed
);

router.get(
  "/history",
  isAuthenticated,
  paymentHistory
);

router.get(
  "/stats",
  isAuthenticated,
  paymentStats
);

export default router;