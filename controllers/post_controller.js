const Post = require('../models/post');
const Comment = require('../models/comments');
const Like = require('../models/likes');
const path = require('path')
const fs = require('fs')

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({})
        Post.uploadedPostImage(req, res, async function(err){
            if(err){console.log("----Multer Error: ", err);}
            post.content = req.body.content
            post.user = req.user._id
            const bruh = new Date()
            const date = bruh.getDate()+"/"+bruh.getDay()+"/"+bruh.getFullYear()
            const time = bruh.getHours()+":"+bruh.getMinutes()
            post.createdDate = date
            post.createdTime = time
            if(req.file){
                // this is saving the path of the uploaded file in the postImage path
                   post.postImage = Post.postImagePath + '/' + req.file.filename;
            }
            post.save()
            if(req.xhr){
                let PoSt = await post.populate('user', 'name avatar')
                return res.status(200).json({
                    data:{
                        post: PoSt
                    },
                    message: "Post Created!"
                })
            }
        })
        req.flash('success', 'Post Published!');
    }
    catch(err){
        console.log("Error--> ", err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id)
        if (post.user == req.user.id) {
            await Like.deleteMany({likeable: post, onModel: "Post"})
            await Like.deleteMany({_id: {$in: post.comments}})
            if(post.postImage){
                fs.unlinkSync(path.join(__dirname, '..', post.postImage))
            }
            post.remove();
            await Comment.deleteMany({ post: req.params.id })
            if(req.xhr){
                req.flash('success', 'Post Removed!');
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: 'Post Deleted!'
                })
            }
            req.flash('success', 'Post Removed!');
            return res.redirect('back');
        }

        else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Error--> ", err);
        return;
    }   
}