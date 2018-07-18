import express from 'express';
import passport from 'passport'
import multer from 'multer'
import * as SchoolController from '../controllers/school.controller';
import * as UserController from '../controllers/user.controller';
import * as AdminController from '../controllers/admin.controller';
import * as ApiController from '../controllers/apiController';
import auth from '../controllers/authController';
import loginRequired from '../middlewares/loginRequired';
import alertEmail from '../middlewares/alertEmail';
const admin = new AdminController.default();
const users = new UserController.default();
const schools = new SchoolController.default();
const api = new ApiController.default();
const appRouter = express.Router();
const upload = multer({ dest: 'public/uploads/' })
// School routes
appRouter.get('/', schools.get4Schools);
appRouter.get('/list', schools.getAllSchools);
appRouter.get('/schools', schools.getAllSchools);
appRouter.post('/addschool', upload.single('image') , loginRequired,schools.addSchool);
appRouter.get('/schools/:SchoolId', schools.getOneSchoolById);
appRouter.post('/delete/:SchoolId', schools.deleteSchool, loginRequired);
appRouter.get('/schools/:SchoolId/reviews', loginRequired , schools.comment);
appRouter.post('/schools/:SchoolId/review', schools.addReview);
appRouter.post('/schools/:SchoolId/verify', loginRequired, schools.verifySchool);
appRouter.get('/schools/:SchoolId/edit',loginRequired, schools.edit);
appRouter.post('/schools/:SchoolId/edit',loginRequired, upload.single('image'), schools.editSchool);
appRouter.post('/search', schools.searchForSchool);
appRouter.get('/about', schools.aboutApp);
appRouter.get('/contact', schools.contactApp);
appRouter.get('/pricing', schools.priceApp);
appRouter.get('/faq', schools.faqApp);
appRouter.get('/reviewers', schools.reviewerApp);
appRouter.post('/schools/reviews/:ReviewId/approve', schools.approveReview)
appRouter.post('/schools/reviews/:ReviewId/disapprove', schools.disapproveReview)

// User Auth routes
appRouter.get('/login', users.enterLogin);
appRouter.get('/signup', users.enterSignup);
appRouter.post('/signup', users.signUp);
appRouter.post('/auth', auth.userAuth)
appRouter.get('/user', loginRequired, users.enterDashboard);
appRouter.get('/logout', users.logout);
appRouter.get('/forgot', users.forgot);
appRouter.get('/reset', users.reset);
appRouter.post('/forgotpass', users.forgotpass);
appRouter.post('/resetpass', users.resetpass);
appRouter.get('/more_details', users.paidPage);
appRouter.post('/contact', users.contactAdmin);

// Admin Auth Routes
appRouter.post('/admin007/newadmin', admin.addAdmin);
appRouter.get('/admin007', alertEmail, admin.enterLoginPaage);
appRouter.post('/admin007/auth', auth.adminAuth,  alertEmail);
appRouter.get('/admin-page', loginRequired, admin.enterDashbaord, alertEmail);
appRouter.get('/logout', admin.logout);
appRouter.delete('/delete/:UserId', loginRequired, admin.deleteUser);
appRouter.post('/admin007/new', admin.addAdmin);

// API routes for mobile (returns Json)
appRouter.get('/api/schools', api.getAllSchools);
appRouter.get('/api/schools/:SchoolId', api.getOneSchoolById);
appRouter.post('/api/schools/new', api.addSchool);
appRouter.delete('/api/schools/:SchoolId/delete', api.deleteSchool);
appRouter.post('/api/schools/search', api.searchSchool);



export default appRouter;
