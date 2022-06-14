const { use } = require('passport')
const Post = require('../models/post')
const User = require('../models/sign_up')

module.exports.getUserData = async function(req, res){
    let user = await User.findById(req.body.id)
    if(req.xhr){
        return res.json(200, {
            name: user.name,
            id: user._id
        })
    }
}

module.exports.getPosts = async function(req, res){
    let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .find({user: req.body.id})
            
    return res.json(200, {
        posts: posts
    })
}