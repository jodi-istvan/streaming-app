import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: validator.isEmail,
    },
    subscribers: {
        type: Number,
        default: 0,
        min: 0,
    },
    likedVideos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Video'
    },
    likedComments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment'
    },
    likedCommentResponses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'CommentResponse'
    }
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcryptjs.hash(this.password, 12);
    next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs.compare(candidatePassword, userPassword);
};
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=user.schema.js.map