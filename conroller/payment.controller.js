import PaymentModel from "../models/payment.model.js";
import UserModel from "../models/user.model.js";
import { sendMail } from "../services/mail.service.js";
import NotificationModel from "../models/notification.model.js";
import MailModel from "../models/mail.model.js";
 

export const createOrder = async (req,res) => {
  try {
    console.log("REQ USER:", req.user);
    const {amount,paymentMethod,paymentDetails} = req.body;
    const orderId = "ORD_" + Date.now();
const payment = await PaymentModel.create({
  userId: req.user.id,
  orderId,
  amount,
  paymentMethod,
  paymentDetails,
});

    return res.status(201).json({
      success: true,
      payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await PaymentModel.findOneAndUpdate(
        { orderId },
        { status: "paid" },
        { new: true }
      );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Send confirmation email and save mail history
    const emailData = {
      to: req.user.email,
      subject: "Payment Successful",
      html: `<h2>Payment Received</h2><p>Your payment of ${payment.amount} ${payment.currency} was successful.</p>`,
    };
    await sendMail(emailData);
    // Save mail history
    await MailModel.create({ ...emailData, userId: req.user.id });
    // Create notification
    await NotificationModel.create({
      userId: req.user.id,
      title: "Payment Successful",
      message: `Your payment of ${payment.amount} ${payment.currency} was successful.`,
      type: "payment",
    });
    return res.status(200).json({
      success: true,
      payment,
      message: "Payment Successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const paymentFailed = async (req, res) => {
    try {
        const { orderId } = req.body;

        const payment =
            await PaymentModel.findOneAndUpdate(
                { orderId },
                { status: "failed", },
                { returnDocument: "after", }
            );

        return res.status(200).json({
            success: true,
            message: "Payment Failed",
            payment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const paymentHistory =async (req, res) => {
    try {
      const payments = await PaymentModel.find({ userId: req.user.id })
          .sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        totalPayments: payments.length,
        payments,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const paymentStats =async (req, res) => {
    try {

      const totalPayments =await PaymentModel.countDocuments();

      const successPayments =await PaymentModel.countDocuments({
          status: "paid",
        });

      const failedPayments =await PaymentModel.countDocuments({
          status: "failed",
        });

      const totalRevenue =await PaymentModel.aggregate([
          {$match: { status: "paid",},},
          { $group: {_id: null,total: { $sum: "$amount",},},},
        ]);

      return res.status(200).json({
        success: true,
        totalPayments,
        successPayments,
        failedPayments,
        totalRevenue:
          totalRevenue[0]?.total || 0,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };