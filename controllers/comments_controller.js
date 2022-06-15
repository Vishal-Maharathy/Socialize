const { redirect } = require('express/lib/response')
const Comment = require('../models/comments')
const Post = require('../models/post')
const commentsMailer = require('../mailer/comments_mailer')
// const queue = require('../config/kue')
// const commentEmailWorker = require('../workers/comment_email_worker')
const commentMailer = require('../mailer/comments_mailer')
const Like = require('../models/likes')
const path = require('path')
const fs = require('fs')

module.exports.create = async function (req, res) {
    try{
        Comment.uploadedCommentImage(req, res, async function(err){
            let post = await Post.findById(req.body.post)
            if (post) {
                console.log(req.body)
                let comment = await Comment.create(
                    {
                    content: req.body.content,
                    user: req.user._id,
                    post: req.body.post
                    }
                )
                if(req.file){
                    comment.commentImage = Comment.commentImagePath + '/' + req.file.filename
                }
                comment.save()
                //pushing comments into post, here id will get pushed since in posts we have made only that field in the posts schema
                post.comments.push(comment);
                post.save();
    
                //earlier this was in req.xhr, but moved it outside because it is required in mailer.
                // comment = await comment.populate('user post');
    
                comment = await comment.populate({
                    path: 'post',
                    populate: {path: 'user'}
                });
                comment = await comment.populate('user')
    
                // here I am passing the comment which is populated with user because in comments_mailer.js, we 
                // made a function that requires user also.
                console.log("Name--> ", comment.user.name);
                console.log("Content--> ", comment.content);    
    
                // commentsMailer.newComment(comment)
                // EARLIER the above line was to be executed, but since this may overlaod the server when large no of
                // users are making comments, therefore it must be handeled. so we are passing this in a QUEUE
               

                // below we passed 'emails' which will tell which queue.process to trigger when saved job will be 
                // passed to comment_email_worker.js
                commentMailer.newComment(comment)
                // let job = queue.create('emails', comment).save((err)=>{
                //     if(err){console.log("error creating a queue!-->", err); return;}
                // })
                console.log(comment)
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment:comment
                        }
                    })
                }
            }
            req.flash('success', 'Comment added!');
            res.redirect('/');
        })
    }catch(err){
        console.log("Error--> ", err);
        return;
    }
    
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            await Like.deleteMany({likeable: comment._id, onModel:'Comment'})
            if(comment.commentImage){
                fs.unlinkSync(path.join(__dirname, '..', comment.commentImage))
            }
            comment.remove();
            let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id }})
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id
                    },
                    message: 'Comment Deleted!'
                })
            }
            req.flash('success', 'Comment Removed!');
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