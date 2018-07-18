import nodemailer from 'nodemailer';
import config from '../config';

const alertEmail = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: config.email,
               pass: config.emailpass
           }
       });
    
       const mailOptions = {
        from: config.email , // sender address
        to: config.admin_email, // receiver
        subject: 'Alert!', // Subject line
        html: `<h1>Hello Admin!</h1> <br/> <p>Someone just gained access to either the admin login page or the dashboard!`// plain text body
    };
    //send mail
    transporter.sendMail(mailOptions, (err, info) => {
        next()
    });
}

export default alertEmail;