const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: 'key-b05c990eea97a8daff7c7a4c09464cb2',
        domain: 'sandbox67595d71b70547068714bc5599af849b.mailgun.org'

    }
};

const transport = nodemailer.createTransport(mailGun(auth));

// sending email
//sendMail('','','', function(err,data){});
const sendMail = (email, subject, text ,cb) => { // cb it's call back func to return data or err 
    const mailOptions = {
        from: email,
        to: 'almothanaa.83@gmail.com',
        subject: subject,
        text: text

    };

    transport.sendMail(mailOptions, function (err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });

};

module.exports = sendMail;