import NotificationModel from "../models/notification.model.js";

export const createNotification =async (req, res) => {
  try {

    const {title,message,type} = req.body;

    const notification =await NotificationModel.create({
        userId: req.user.id,
        title,
        message,
        type,
      });

    return res.status(201).json({
      success: true,
      message:
        "Notification created successfully",
      notification,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotifications =async (req, res) => {
  try {

    const notifications = await NotificationModel.find({ userId: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:notifications.length,
      notifications,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAsRead =async (req, res) => {
  try {

    const { id } = req.params;

    const notification =await NotificationModel.findByIdAndUpdate(id,{ isRead: true,},{ new: true,});

    return res.status(200).json({
      success: true,
      message:"Notification marked as read",
      notification,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {

    const { id } = req.params;

    await NotificationModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message:"Notification deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unreadCount = async (req, res) => {
  try {

    const count = await NotificationModel.countDocuments({ userId: req.user.id, isRead: false });

    return res.status(200).json({
      success: true,
      unreadCount: count,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};