import cloudinary from 'cloudinary';
import nodemailer from 'nodemailer';
import multer from 'multer';
import School from '../models/school.model';
import Review from '../models/review.model';
import User from '../models/user.model';
import config from '../config';

// cloudinary config/auth
cloudinary.config({ 
    cloud_name: config.Cloud_name, 
    api_key: config.API_Key, 
    api_secret: config.API_Secret 
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: config.email,
           pass: config.emailpass
       }
});

export default class SchoolController {
    getHome(req, res){
        res.render('index');
    }
    addSchool(req, res){
        cloudinary.uploader.upload(req.file.path, (image) => { 
            const school = new School({
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                location: req.body.location,
                addresss: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                image: image.url,
                uploadedBy: req.user.username
            });
            school.save((err, school) => {
                if(err){
                    res.render('400', {error: 'Please go back and fill in all required fields',
                    errorcode: 401});
                }else{
                    User.findOne({username: req.user.username}, (err, foundUser) => {
                        foundUser.schools.push(school);
                        foundUser.save((err, data) => {
                            console.log('success');
                        });
                    })
                    res.redirect('/user');
                }
            })
        });
       
    }
    getOneSchoolById(req, res) {
        // Find a single School with a SchoolId
        School.findOne({ _id: req.params.SchoolId})
                            .populate('reviews')
                            .exec((err, school) => {
                                if(school){
                                    const host = config.host;
                                    const userActive = req.user;
                                    let verified = [];
                                    let unverified = [];
                                    let editable = false;
                                    school.reviews.forEach(review => {
                                        if(review.approved){
                                            verified.push(review)
                                        }else{
                                            unverified.push(review)
                                        }
                                    });
                                    if( userActive === undefined || userActive.plan === 'free'){
                                        verified = verified.slice(0, 3);
                                        unverified = null;
                                    }
                                    if(userActive){
                                        if(userActive.admin && unverified ){
                                            editable = true
                                        }
                                    }
                                    console.log(unverified)
                                    
                                    res.status(200)
                                        .render('paid_view', {title: school.name, school, userActive, host, verified, unverified, editable });
                                }
                            })
    };
    addReview(req, res){
        School.findById(req.params.SchoolId, (err, school) => { 
            if (school) {
                    let newReview = new Review({
                        name: req.body.name || 'Anonymous'  || req.user.username ,
                        comment: req.body.comment,
                        type: req.body.reviewtype,
                        school: school._id
                    });
                    newReview.save((err, review) => {
                        if(review.type == 'upvote'){
                            school.upvotes = school.upvotes + 1
                        }
                        if(review.type == 'downvote'){
                            school.downvotes = school.downvotes + 1
                        }
                        if(review.type == 'issue'){
                            school.issues = school.issues + 1
                        }
                        school.reviews.push(review._id);
                        if(req.user){
                            User.findOne({ _id: req.user._id }, (err, user) => {
                                user.schools_reviewed.push(review._id)
                                user.save((err, savedUser) => {
                                    school.save((err, savedSchool) => {
                                        res.redirect(`/schools/${savedSchool._id}`);
                                    });
                                });
                            });
                        }else{
                            // Save the updated document back to the database
                            school.save((err, savedSchool) => {
                                res.redirect(`/schools/${savedSchool._id}`);
                            });
                        }
                    });
                }
        });
        

    }
    
    get4Schools(req, res){
        // Retrieve and return all schools from the database.
        School.find((err, schools) => {
                const last = schools.slice(Math.max(schools.length - 4, 1));
                const userActive = req.user || null
                res.render('index', {last, userActive});
        });
    }
    getAllSchools(req, res){
        // Retrieve and return all schools from the database.
        School.find((err, schools) => {
            const userActive = req.user
            res.render('list', {schools, userActive});
        });
    }
    // routes for new pages
    // about page
    aboutApp(req, res){
        res.render('about');
    }
    // contact page
    contactApp(req, res){
        res.render('contact');
    }
    // faq page
    faqApp(req, res){
        res.render('faq');
    }
    // pricing
    priceApp(req, res){
        res.render('pricing');
    }
    // reviwer route
    reviewerApp(req, res){
        res.render('reviewer');
    }
    searchForSchool(req, res){
        School.find({ type: req.body.type, location: req.body.location}, (err, schools) => {
            if(err){
                console.log(err);
            }
            res.render('list', {schools})
        })
    }
    deleteSchool(req, res){
        School.remove(req.params.SchoolId, (err, school)=>{
            if(err){
                res.redirect('/user')
            }else{
                User.findOne({email: req.user.email}, (err, user) => {
                    if(user){
                        let deletedSchool = user.schools.indexOf(school);
                        user.schools.splice(school, 1)
                        user.save((err, user) => {
                            if(req.user.admin){
                                res.redirect('/admin-page');
                            }else{
                                res.redirect('/user');
                            }
                        });
                    }
                });
            }
        });
    }
    verifySchool(req, res){
        School.findById(req.params.SchoolId, (err, school) => { 
            if (err) {
                res.status(500).send(err)
                console.log(err)
            }
            if (school) {
                    school.name = school.name;
                    school.description = school.description;
                    school.fees = school.fees;
                    school.reviews = school.reviews;
                    school.stars = school.stars
                    school.type = school.type;
                    school.location = school.location;
                    school.address = school.address;
                    school.accepted = true
                    // Save the updated document back to the database
                    school.save((err, school) => {
                        if (err) {
                            res.status(500)
                            console.log(err)
                        }
                    res.redirect('/admin-page');
                    });
                }
        });
    }
    edit(req, res){
        School.findOne({_id: req.params.SchoolId}, (err, school) => {
            if(err){
                console.log(err)
            }else{
                res.render('edit', {school});
            }
        });
    }
    editSchool(req, res){
        School.findById(req.params.SchoolId, (err, school) => { 
            if (school) {
                    school.name =  req.body.name || school.name
                    school.description =  req.body.description || school.description
                    school.reviews = school.reviews || school.reviews
                    school.stars = school.stars || school.stars
                    school.type =  req.body.type || school.type
                    school.location =  req.body.location || school.location
                    school.address =  req.body.address || school.address
                    school.email =  req.body.email || school.email
                    school.phone =  req.body.phone ||  school.phone
                    school.image = req.body.image || school.image
                    // Save the updated document back to the database
                    school.save((err, school) => {
                        if (err) {
                            res.status(500)
                            console.log(err)
                        }
                    res.redirect(`/schools/${school._id}`);
                    });
                }
        });
    }
    comment(req, res){
        School.findOne({ _id: req.params.SchoolId })
                        .populate('reviews')
                        .exec((err, school) => {
                            if(err) console.log(err);
                            if(school){
                                res.render('review_comment', {school})
                            }
                        });
    }
    approveReview(req, res){
        Review.findById(req.params.ReviewId, (err, review) => {
            review.approved = true
            review.save((err, approvedReview) => {
                School.findOne({ _id: approvedReview.school }, (err, school) => {
                    res.redirect(`/schools/${school._id}`)
                });
            });
        });
    }
    disapproveReview(req, res){
        Review.findById(req.params.ReviewId, (err, review) => {
            review.approved = false;
            review.save((err, approvedReview) => {
                School.findOne({ _id: approvedReview.school }, (err, school) => {
                    res.redirect(`/schools/${school._id}`)
                });
            });
        });
    }
}