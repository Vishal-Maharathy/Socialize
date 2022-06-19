const mongoose = require('mongoose');
const LikeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    // what post or comment is liked, its id is saved in likeable
    likeable : {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    //to choose between whether a post is liked or a comment
    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
}, {timestamps:true})

const Like = mongoose.model('Like', LikeSchema)

module.exports = Like