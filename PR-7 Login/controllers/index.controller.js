const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../middleware/sendEmail');

exports.logOutAdmin = async (req, res) => {
    try {
        req.session.destroy((err, data)=> {
            if(err) console.log(err)
                else{
                    return res.redirect("/");
                }
        })
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}

exports.myProfile = async (req, res) => {
    try {
        return res.render("myProfile", { user: req.user });
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}

exports.changePasswordPage = async (req, res) => {
    try {
        return res.render("changePassword");
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { curPassword, newPassword, conPassword } = req.body;
        const user = req.user;
        let verifyPass = await bcrypt.compare(curPassword, user.password);
        if(!verifyPass){
            console.log('Current password is not matched');
            return res.redirect("/change-password");
        }
        if(curPassword == newPassword){
            console.log('Current and New password is matched');
            return res.redirect("/change-password");
        }
        if(newPassword != conPassword){
            console.log('New password and confirm password is not matched');
            return res.redirect("/change-password");
        }

        let hashPassword = await bcrypt.hash(newPassword, 10);
        await Admin.findByIdAndUpdate(user._id, {password: hashPassword}, {new: true});
        console.log('Password Changed!!!!');
        return res.redirect("/");   
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}
exports.home = async (req, res) => {
    try {
        if(req.isAuthenticated()){
            return res.redirect("/dashboard")
        }else
            return res.render("login");
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}
exports.dashboard = async (req, res) => {
    try {
        return res.render("dashboard");
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}
exports.login = async (req, res) => {
    try {
        return res.redirect("/dashboard");
    } catch (error) {
        console.log(error)
        return res.redirect("/");
    }
}


  // forgot pass
exports.forgotPasswordPage = async (req, res) => {
    try {
        return res.render("forgotpassword/forgotpassword")
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
}

exports.verifyOtpPage = async (req, res) => {
    try {
        return res.render("forgotpassword/verifyOtpPage")
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
}
exports.resetPasswordPage = async (req, res) => {
    try {
        return res.render("forgotpassword/resetPasswordPage")
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
}

exports.sendOtp = async (req, res) => {
    try {
        let {email} = req.body;
        let admin = await Admin.findOne({email: email})
        if(!admin){
            return res.redirect("/forgot-password");
        }                  
        let otp = otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars:false})
        
        let message = {
            from: `rw3.girish.gk@gmail.com`,
            to: `${email}`,
            subject: 'Your Reset Password OTP!!!',
            html:`
            <h1>Hello, ${admin.firstname}</h1>
            <p>Your Reset Password OTP is: ${otp}. OTP is valid only 5 Minutes.</p>
            `
        }

        sendEmail(message);
        res.cookie('otp', otp);
        res.cookie('email', email);
        return res.redirect("/verify-otp");
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
}
exports.verifyOtp = async (req, res) => {
    try {
        const otp = req.body.otp;
        const OTP = req.cookies.otp;
        if(otp != OTP){
            return res.redirect("/verify-otp");
        }
        res.clearCookie('otp');
        return res.redirect("/reset-password");
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
}
exports.resetPassword = async (req, res) => {
    try {
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/")
    }
}