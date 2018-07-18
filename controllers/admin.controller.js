import mongoose from 'mongoose';
import app from '../app'
import passport from 'passport';
import School from '../models/school.model';
import User from '../models/user.model';

export default class AdminController {
    addAdmin(req, res){
        User.register(new User({username: req.body.username, email: req.body.email, admin: true}), req.body.password,
        (err, user) => {
            if(err) {
                return res.render('admin');
                console/log(err)
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/admin-page');
            })
        })
    }
    enterLoginPaage(req, res){
        res.render('admin')
    }
    comment(req, res){
        res.render('review_comment');
    }
    authenticate(){
        passport.authenticate('local', {
            successRedirect: '/admin-page',
            failureRedirect: '/admin007'
        }), (req, res) => {
            console.log(req.user.admin);
        }
    }
    enterDashbaord(req, res){
        if(req.user.admin){
            School.find((err, schools) => {
                User.find((err, users) => {
                    res.render('admin-page', {users, schools});
                });
            });
        }else{
            res.render('404', {errorcode: 401, error: 'Unauthorized'});
        }
    }
    logout(req, res){
        req.logout();
        res.redirect('/')
    }
    deleteUser(req, res){
        User.remove(req.params.UserId, (err, user)=>{
            if(err){
                res.redirect('/admin-page');
            }else{
                res.redirect('/admin-page');
            };
        });
    };
};