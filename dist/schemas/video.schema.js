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
    thumbnailPath: {
        type: String,
        required: true,
        trim: true,
    },
    mpdPath: {
        type: String,
        required: true,
        trim: true,
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
    likes: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
export const Video = mongoose.model('Video', videoSchema);
//# sourceMappingURL=video.schema.js.map