const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'ayushidaslani75@gmail.com',
        pass: 'odnpnbtziznzycpy'
    }
})

const sendEmail = async (message) => {
    let res = await transporter.sendMail(message)
}

module.exports = sendEmail;