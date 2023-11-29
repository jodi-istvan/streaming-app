import mongoose from 'mongoose';
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true
    },
    videoFileId: {
        type: String,
        required: true
    },
    thumbnailPath: {
        type: String,
        required: true,
        trim: true
    },
    mpdPath: {
        type: String,
        required: true,
        trim: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
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
    },
    dislikes: {
        type: Number,
        required: true,
        default: 0
    }
});
export const Video = mongoose.model('Video', videoSchema);
//# sourceMappingURL=video.schema.js.map