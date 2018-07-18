import User from '../models/user.model';
import Review from '../models/review.model';
import mongoose from 'mongoose';
import passport from 'passport';
import nodemailer from 'nodemailer';
import config from '../config';
import School from '../models/school.model';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: config.email,
           pass: config.emailpass
       }
   });


export default class UserController {
    signUp(req, res){
        if(!req.body.email && !req.body.password && !req.body.username){
            res.render('signup', {error: 'Please fill in all required fields'})
        }else if(req.body.username.length < 5 || req.body.password.length < 5){
            res.render('signup', {error: 'Username and password should not be less than 5 characters long!'})
        }else if(req.body.username.length > 20 ||  req.body.password.length > 20){
            res.render('signup', {error: 'Too Long! Username and password should not be more than 20 characters long!'})
        }else{
            User.register(new User({username: req.body.username,
                                    email: req.body.email,
                                    plan: req.body.plan
                                }), req.body.password,
                (err, user) => {
                if(err) {
                    return res.status(400).render('signup', {error: err});
                }
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/user');
                    // email content, sender, receiver
                    const mailOptions = {
                        from: config.email , // sender address
                        to: req.user.email, // receiver
                        subject: 'Welcome to School Review!', // Subject line
                        html: `<h1>Welcome to SchoolReview, add schools, review schools.</h1><br /><h2>Login into your dashboard <a href="${config.host}/login"> here</a></h2>`// plain text body
                    };
                    //send mail
                    transporter.sendMail(mailOptions, (err, info) => {
    
                    });
                });
            });
        }
    }
    logout(req, res){
        req.logout();
        res.status(200).redirect('/')
    }
    // paid school page
    paidPage(req, res){
        res.render('paid_view');
    }
    deleteUser(req, res){
        User.findByIdAndRemove(req.params.UserId, (err, users) =>{
            if(err){
                console.log(err)
                res.redirect('/admin-page');
            }
            res.redirect('/admin-page');
        })
    }
    getAllUsers(req, res){
        User.find((err, users) => {
            res.render('admin-page',  {users});
        });
    }
    enterDashboard(req, res){
        User.findOne({_id: req.user._id}, (err, user) => {
            if(err){
                res.redirect('/');
            }else{
                console.log(user)
                let reviewedSchools = []
                if(user.schools_reviewed.length > 0){
                    user.schools_reviewed.forEach(id => {
                        Review.findOne({ _id: id }).populate('school').exec((err, review) => {
                            reviewedSchools.push(review.school)
                        });
                    });
                    res.render('user', {user, reviewedSchools});
                }
            }
        });
    };
    enterLogin(req, res){
        if(req.user){
            res.redirect('/user');
        }
        res.render('login');
    }
    enterSignup(req, res){
        if(req.user){
            res.redirect('/user');
        }
        res.render('signup');
    }
    forgot(req, res){
        res.render('forgot');
    }
    reset(req, res){
        if(req.user){
            res.redirect('/user');
        }
        res.render('reset');
    }
    forgotpass(req, res){
        if(req.user){
            res.redirect('/user');
        }
        User.findOne({email: req.body.email}, (error, user) => {
            if(error){
                res.render('forgot', {message:  `Sorry, This email ${req.body.email} is not registered with us.`})
            }else{
                 const mailOptions = {
                    from: config.email, // sender address
                    to: user.email, // receiver
                    subject: 'Reset SchoolReview Account Password', // Subject line
                    html: `<h1>HIi!</h1><br /><h2>Your made a request to change your school review account password <br/><p> Please do that here: <a href="${config.host}/reset"> here</a></p></h2>`// plain text body
                };
                //send mail
                transporter.sendMail(mailOptions, (err, info) => {
                });
                res.render('forgot', {message: `An Email has been sent to ${user.email}, Please check your email!`});
            }
        })
    }
    resetpass(req, res){
        if(req.user){
            res.redirect('/user');
        }
        User.findOne({ email: req.body.email }, (err, user) =>{
            if(err){
                res.render('reset', {message: 'Oops, I am not sure if this email is registered with us'})
            }else{
                user.email = user.email
                user.username = user.username
                user.password = req.body.password

                user.save((err, result)  => {
                    if(result){
                        res.render('reset', {message: 'Your password has been reset successfully, you can now login successfully'})
                    }
                    else{
                        res.render('reset', {message: 'An error occured, please try again...'});
                        const mailOptions = {
                            from: config.email, // sender address
                            to: req.body.email, // receiver
                            subject: 'Reset SchoolReview Account Password', // Subject line
                            html: '<h1>HIi!</h1><br /><h2>Your password has been changed successfully!</h2>'// plain text body
                        };
                        //send mail
                        transporter.sendMail(mailOptions, (err, info) => {
                        });
                    }
                })
            }
        })
    }
    contactAdmin(req, res){
        User.find({ admin: true }, (err, admins) => {
            admins.forEach(admin => {
                const mailOptions = {
                    from: config.email , // sender address
                    to: admin.email, // receiver
                    subject: 'Consult IFA Contact Message!', // Subject line
                    html: `<h1>Hi Admin!</h1>
                     <br>
                     <h2> ${req.body.msg} </h2>
                     <h3>Email: ${req.body.email}</h3></br>
                     <h3>Phone: ${req.body.phone}</h3></br>
                    `// plain text body
                };
                //send mail
                transporter.sendMail(mailOptions, (err, info) => {
                    res.redirect('/contact')
                });
            });
        })
    }
};
