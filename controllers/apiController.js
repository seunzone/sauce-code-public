import School from '../models/school.model';
import User from '../models/user.model'

export default class ApiController {
    addSchool(req, res){
        const school = new School({
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            location: req.body.location,
            addresss: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image,
            uploadedBy: req.user
        });
        school.save((err, school) => {
            if(err){
                res.json('404', {error: 'Please go back and fill in all required fields',
                errorcode: 401});
            }else{
                User.findOne({username: req.user.username}, (err, foundUser) => {
                    foundUser.schools.push(school);
                    foundUser.save((err, data) => {
                        console.log('success');
                    });
                })
                res.json({
                    school: school
                });
            }
        })
    }
    getOneSchoolById(req, res) {
        // Find a single School with a SchoolId
        School.findById(req.params.SchoolId, (err, school) => {  
            if (err) {
                res.send(err.message)
            }
            if (school) {
                const userActive = req.user
                res.status(200)
                .json({
                    school: school
                });
            }
        });
    };
    addReview(req, res){
        School.findById(req.params.SchoolId, (err, school) => { 
            if (err) {
                res.status(500).send(err)
                console.log(err)
            }
            if (school) {
                let total = 0;
                school.reviews.forEach((review) => {
                    total+= review.star/school.reviews.length;
                })
                let reviews = {
                        name: req.body.name || req.user.username,
                        comment: req.body.comment,
                        star: req.body.star,
                        type: req.body.reviewtype
                    }
                    school.name = school.name;
                    school.description = school.description;
                    school.fees = school.fees;
                    school.reviews.push(reviews)
                    school.stars = Math.round(total);
                    school.type = school.type;
                    school.location = school.location;
                    school.address = school.address;
                    // Save the updated document back to the database
                    school.save((err, school) => {
                        if (err) {
                            res.status(500)
                            console.log(err)
                        }
                        res.json({
                            message: 'Review added successfully'
                        });
                    });
                }
        });
    }
    getAllSchools(req, res){
        // Retrieve and return all schools from the database.
        School.find((err, schools) => {
            const userActive = req.user
            res.json({
                schools: schools
            });
        });
    }
    searchSchool(req, res){
        School.find({ type: req.body.type, location: req.body.location}, (err, schools) => {
            if(err){
                console.log(err);
            }
            res.json({
                schools: schools
            });
        })
    }
    deleteSchool(req, res){
        School.remove(req.params.SchoolId, (err, school)=>{
            if(err){
                res.json({
                    error: 'network problem...'
                })
            }else{
                res.json({
                    message: 'school deleted successfully'
                });
            }
        });
    }
}