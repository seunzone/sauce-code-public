import mongoose from 'mongoose';
import School from './school.model';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema =  new mongoose.Schema({
    email: {required: true, type: String},
    username: {required: true, type: String},
    password: {type: String},
    admin: {type: Boolean},
    schools: [],
    plan: {type: String, required: false},
    schools_reviewed: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', UserSchema);