import { sendMail } from "../services/mail.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js";

const otpStore = new Map();

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const UserExists = await UserModel.findOne({ email });

    if (UserExists) {
      return res.status(400).json({
        success: false,
        message: "User already Exists"
      });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashedpassword,
    });

    const token = jwt.sign({
      id: user._id,
      email: user._email,
    }, process.env.JWT_SECRET, { expiresIn: "2d" })

    return res.status(200).json({
      success: true,
      message: "User register successfully",
      token,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({
      id: user._id,
      role: user.role,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "2d" })

    return res.status(200).json({
      success: true,
      message: "User Login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body

    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      });
    }

    const ispasswordMatch = await bcrypt.compare(password, user.password);

    if (!ispasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "old password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "password changed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 60 * 1000, // 1 Minute
    });

    await sendMail({
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 1 minute.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const VerfiyOtp = (req, res) => {
  const { email, otp } = req.body;

  const otpData = otpStore.get(email);

  if (!otpData) {
    return res.status(400).json({
      success: false,
      message: "OTP Expired",
    });
  }

  // Check Expiry
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(email);

    return res.status(400).json({
      success: false,
      message: "OTP Expired",
    });
  }

  // Check OTP
  if (otpData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  otpStore.delete(email);

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    otpStore.set(email, { otp, expiresAt: Date.now() + 60 * 1000, });

    await sendMail({
      to: email,
      subject: "Reset password OTP",
      html: `<h2>Reset Password</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Valid for 1 minute</p> `,
    });

    return res.status(200).json({
      success: true,
      message: "Reset OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpStore.delete(email);

    // Database update yaha hoga
    console.log("New Password:", newPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find().select("-password");

    const totalusers = await UserModel.countDocuments();

    return res.status(200).json({
      success: true,
      totalusers,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })

  }
}

export const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successfully"
  })
}