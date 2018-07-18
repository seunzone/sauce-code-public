import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const AdminSchema = mongoose.Schema({
    password: {type: String},
    username: {type: String, required: true},
});

AdminSchema.plugin(passportLocalMongoose)

export default mongoose.model('Admin', AdminSchema);