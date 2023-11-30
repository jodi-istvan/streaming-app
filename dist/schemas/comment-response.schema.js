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
    likes: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});
export const CommentResponse = mongoose.model('CommentResponse', commentResponseSchema);
//# sourceMappingURL=comment-response.schema.js.map