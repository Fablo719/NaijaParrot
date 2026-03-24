const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    postContent: {
        type: String,
        required: true,
        trim: true
    },
    postCategory: {
        type: String,
        enum: ['general', 'announcement', 'question', 'discussion', 'update'],
        default: 'general'
    },
    postImage: {
        type: String,
        default: null
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    savedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

    comments: [commentSchema],
    shares: {
        type: Number,
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
postSchema.index({ createdAt: -1 });  // For sorting by date
postSchema.index({ authorId: 1, createdAt: -1 });  // For finding user posts
postSchema.index({ postCategory: 1 });  // For filtering by category

module.exports = mongoose.model('Post', postSchema);