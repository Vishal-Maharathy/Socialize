const Like = require('../models/likes')
const Comment = require('../models/comments')
const Post = require('../models/post');
const User = require('../models/sign_up')
let io_client = require('socket.io-client')
let socket = io_client('https://socialize-u707.onrender.com')

module.exports.toggleLike = async function(req, res){
    // below three params are for socket.io live like sent{
    let like_who = res.locals.user._id /*who liked the post/comment */ 
    let post_liked;
    let comment_liked;
    let like_whose; /*whose post/comment is liked */ 
    //}
    try{
        //likes/toggle/?id=abcd&types= Post OR Comment
        let likeable;
        let deleted = false;
        let num_of_likes
        if(req.query.type=='Post'){
            likeable = await Post.findById(req.query.id)
            post_liked = req.query.id
            like_whose = likeable.user
            num_of_likes = likeable.likes.length
        }
        else{
            likeable = await Comment.findById(req.query.id)
            comment_liked = req.query.id;
            like_whose = likeable.user
            num_of_likes = likeable.likes.length
        }
        // check if like already exists
        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        })
        // if like already exist then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save()
            existingLike.remove()
            deleted = true
            let user_liked = await User.findById(like_whose)
            user_liked.likeNotif.pull(existingLike._id)
            user_liked.save()
            // here make the ajax request and decrement the like
            if(req.xhr){
                return res.json(200, {
                    data: {
                        ifDeleted: deleted,
                        nums: num_of_likes-1,
                        message: "Like Removed"
                    }
                })
            }
        }
        else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            })
            likeable.likes.push(newLike._id);
            likeable.save();
            // push the like to likeNotif of the user whose post/comment is liked
            let user_liked = await User.findById(like_whose)
            user_liked.likeNotif.push(newLike._id)
            user_liked.save()
            // increase notification counter of notification badge
            socket.emit('notification_ping', {sender: like_who, reciever: like_whose})
            // here make the ajax request and increment the like
            if(req.xhr){
                return res.json(200, {
                    data: {
                        ifDeleted: deleted,
                        nums: num_of_likes+1,
                        message: "Liked"
                    }
                })
            }
        }
        return res.json(200, {
            message: "Request Successful",
            data: {
                deleted: deleted
            }
        })

    }catch(err){
        console.log("Error in Like", err);
        return res.json(500, {
            message: "Internal Server Error!"
        })
    }
}

module.exports.popUpToggle = async function(req, res){
    try{
        let content_id = req.query.id;
        let typeOfLike = req.query.type
        let Likes = await Post.findById(content_id).populate('likes')
        // let bruh = Likes.populate('likes')
        Likes = Likes.likes
        let Users = []
        for(each of Likes){
            Users.push(each.user)
        }
        let Names = []
        let runloop = function(){
            for(i of Users){    
                // pushes a promise since return in .then() returns a promise
                Names.push(User.findById(i).then(data=>{return data.name}))
            }
            // waits for all promises to complete and returns a single promise
            return Promise.all(Names)
        }
        runloop().then(data=>{
            // pass the data to your ajax request  (data contains the names of all the likers)
            if(req.xhr){
                return res.json(200,{
                    data:{
                        names: data,
                        postid: content_id,
                        type: typeOfLike
                    }
                })
            }
        })
    }
    catch(err){
        console.log("error in popUpController-->", err)
        return res.json(500, {
            message: "Internal Server Error! POPUP"
        })
    }
}
