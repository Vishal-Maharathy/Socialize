const Post = require('../models/post');
const User = require('../models/sign_up');

module.exports.home = async function(req, res){
    console.log("Home Controller Called!");
    try{
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
        let users = await User.find({});
        if(res.locals.user){
            let logged_in_user = await User.findById(res.locals.user._id)
            let no_of_notif = logged_in_user.acceptedFR.length + logged_in_user.pendingFR.length
            let friends = await logged_in_user.populate('friendShip')
            return res.render('layout', {
                title: "Socialize",
                posts: posts,
                all_users: users,
                no_of_notif: no_of_notif,
                friends: friends.friendShip
            });
        }
        else{
            return res.render('layout', {
                title: "Socialize",
                posts: posts,
                all_users: users
            });
        }
        
    }
    catch(err){
        console.log(err);
    }    
}