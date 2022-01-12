const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: 'neosoftCoders@gmail.com',
        pass: 'neosoftCoders123'
    }
});


const sendMail = (OTP, email) => {
    console.log("in nodemailer", OTP, email)
    const mailData = {
        from: 'neosoftCoders@gmail.com',  // sender address
        to: email,   // list of receivers
        subject: 'OTP Verification',
        text: 'OTP for Account verification',
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + OTP + "</h1>"
    };
    transporter.sendMail(mailData, (err, data) => {
        if (err) {
            throw err;
        }
        else
            console.log(data)
    });

}

module.exports = sendMail;

