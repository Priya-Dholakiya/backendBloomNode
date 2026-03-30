const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 858,
    secure: false,
    auth: {
        user: 'bodardakshit2@gmail.com',
        pass: 'elchwovptiofvwme'
    }
})

const sendEmail = async (message) => {
    let res = await transporter.sendMail(message)
}

module.exports = sendEmail;