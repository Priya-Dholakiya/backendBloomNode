const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");

// ===============================
// Forgot Password Page
// ===============================
exports.forgotPasswordPage = async (req, res) => {
  try {
    return res.render("forgotpassword/forgotpassword");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// ===============================
// Verify OTP Page
// ===============================
exports.verifyOtpPage = async (req, res) => {
  try {
    return res.render("forgotpassword/verifyOtpPage");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// ===============================
// Reset Password Page
// ===============================
exports.resetPasswordPage = async (req, res) => {
  try {
    return res.render("forgotpassword/resetPasswordPage");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// ===============================
// Send OTP
// ===============================
exports.sendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    let admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("Admin not found");
      return res.redirect("back");
    }

    let otp = Math.floor(1000 + Math.random() * 9000);

    req.session.otp = otp;
    req.session.email = email;

    console.log("Generated OTP:", otp);

    return res.redirect("/verify-otp");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// ===============================
// Verify OTP
// ===============================
exports.verifyOtp = async (req, res) => {
  try {
    let { otp } = req.body;

    if (otp == req.session.otp) {
      return res.redirect("/reset-password");
    } else {
      console.log("Invalid OTP");
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

// ===============================
// Reset Password
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    let { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      console.log("Password not match");
      return res.redirect("back");
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    await Admin.findOneAndUpdate(
      { email: req.session.email },
      { password: hashedPassword },
    );

    req.session.destroy();

    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
