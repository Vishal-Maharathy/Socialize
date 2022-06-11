const mongoose = require('mongoose');
const multer = require('multer')
const path = require('path')
const IMG_PATH = path.join('/uploads/users/photos_comments')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    // comment belongs to a user
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //comments belongs to a post
    post:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    commentImage: {
        type: String
    }
},{timestamps: true})

let Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', IMG_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

//static methods
commentSchema.statics.uploadedCommentImage = multer({ storage: Storage }).single('commentImage');
commentSchema.statics.commentImagePath = IMG_PATH; 

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment