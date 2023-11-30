import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});
export const Comment = mongoose.model('Comment', commentSchema);
//# sourceMappingURL=comment.schema.js.map