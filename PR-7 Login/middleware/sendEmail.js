const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user:"shreyapal0411@gmail.com",
        pass: "Shreya@123456"
    }
});


exports.sendEmail = async (message) => {
    let res = await transport.sendMail(message);
    console.log("Mail Response: ",res);
    return res;
}