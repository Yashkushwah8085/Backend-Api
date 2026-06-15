import express from "express";

import {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  unreadCount,
} from "../conroller/notification.controller.js";
 import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create",isAuthenticated,createNotification);

router.get("/",isAuthenticated,getNotifications);

router.put("/read/:id",markAsRead);

router.delete("/:id",deleteNotification);

router.get("/unread-count",isAuthenticated,unreadCount);

export default router;