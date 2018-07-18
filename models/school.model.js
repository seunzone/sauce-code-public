import mongoose from 'mongoose';
import User from './user.model';

const SchoolSchema = mongoose.Schema({
    name: {required: true, type: String},
    description: {required: true, type: String},
    type: {type: String, required: true},
    location: {type: String, required: true},
    address: {type: String, required: false},
    fees: {type: String, required: false},
    email: {type: String, required: false},
    phone: {type: String, required: false, default: false},
    stars: {type: Number, required: false},
    upvotes: {type: Number, required: false, default: 0},
    downvotes: {type: Number, required: false, default: 0},
    issues: {type: Number, required: false, default: 0},
    image: {type: String},
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    accepted: {type: Boolean, required: false},
    uploadedBy: {type: String}
},
{
    timestamps: true 
});

export default mongoose.model('School', SchoolSchema);