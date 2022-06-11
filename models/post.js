const mongoose = require('mongoose');
const multer = require('multer')
const path = require('path')
const IMG_PATH = path.join('/uploads/users/photos_post')

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdDate: {
        type: String
    },
    createdTime: {
        type: String
    },
    //include the array which will include the ids of the comments
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    postImage: {
        type: String
    }

}, {
    timestamps:true
})

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', IMG_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

//static methods
postSchema.statics.uploadedPostImage = multer({ storage: storage }).single('postAttachment');
postSchema.statics.postImagePath = IMG_PATH; 


const Post = mongoose.model('Post', postSchema);
module.exports = Post