import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ReviewSchema = Schema({
    name: { type: String, required: false },
    type: { type: String, required: false },
    comment: { type: String, required: false },
    approved: {type: Boolean, default: false},
    school: { type: Schema.Types.ObjectId, ref: 'School' },
});

export default mongoose.model('Review', ReviewSchema);