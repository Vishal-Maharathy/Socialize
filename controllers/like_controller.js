const Like = require('../models/likes')
const Comment = require('../models/comments')
const Post = require('../models/post');
const User = require('../models/sign_up')

module.exports.toggleLike = async function(req, res){
    try{
        //likes/toggle/?id=abcd&types= Post OR Comment
        let likeable;
        let deleted = false;
        let num_of_likes
        if(req.query.type=='Post'){
            likeable = await Post.findById(req.query.id)
            Post.findById(req.query.id, function(err, posts){
                num_of_likes = posts.likes.length
            })
        }
        else{
            likeable = await Comment.findById(req.query.id)
            Comment.findById(req.query.id, function(err, comments){
                num_of_likes = comments.likes.length
            })
        }
        console.log(req.query.id, num_of_likes);
        // check is like already exists
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