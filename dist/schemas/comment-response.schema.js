import mongoose from 'mongoose';
const commentResponseSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    }
});
export const CommentResponse = mongoose.model('CommentResponse', commentResponseSchema);
//# sourceMappingURL=comment-response.schema.js.map