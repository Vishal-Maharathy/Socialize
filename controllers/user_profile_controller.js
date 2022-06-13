const { use } = require('passport')
const Post = require('../models/post')
const User = require('../models/sign_up')

module.exports.getUserData = async function(req, res){
    let user = await User.findById(req.body.id)
    console.log(user.name)
    if(req.xhr){
        return res.json(200, {
            name: user.name,
            id: user._id
        })
    }
}