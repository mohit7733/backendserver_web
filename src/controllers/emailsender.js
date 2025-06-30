const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sdssoftform@gmail.com',
        pass: 'nmviqlgrlzuzpmoj'
    }
});

const sendEmail = async (to, subject, htmlOrObj) => {
    let html = htmlOrObj;
    if (typeof htmlOrObj === 'object' && htmlOrObj !== null && htmlOrObj.html) {
        html = htmlOrObj.html;
    }
        if (typeof html !== 'string') {
        html = String(html);
    }

    const mailOptions = {
        from: 'sdssoftform@gmail.com',
        to,
        subject,
        html
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };




