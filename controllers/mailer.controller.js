const nodemailer = require('nodemailer');
const config = require("../config/config");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.mailSender.mail,
        pass: config.mailPassword.password
    }
});

async function sendTheMail(mailReceiver, mailSubject, mailBody) {

    var mailOptions = {
        from: config.mailSender.mail,
        to: mailReceiver,
        subject: mailSubject,
        text: mailBody
    };

    /*transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });*/

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                try {
                    resolve(info);
                    console.log('Email sent: ' + info.response);
                }
                catch (err) {
                    console.log('Error : ' + err);
                }
            }
        });
    });
}


module.exports = { sendTheMail };