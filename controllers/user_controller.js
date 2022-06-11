const User = require('../models/sign_up');
const passSchema = require('../models/password_reset')
const path = require('path');
const jwt = require('jsonwebtoken')

//below are imported for sending mail for resetting password
const queue = require('../config/kue')
const passResetWorker = require('../workers/password_reset')
const passReserMailer = require('../mailer/password_reset_mailer')

//this is profile in the coding ninjas videos, don't get confused.
module.exports.user = async function(req, res){
    let user = await User.findById(req.params.id)
    let no_of_notif = req.user.acceptedFR.length + req.user.pendingFR.length
    
    //checking if user we visiting is a friend of the current logged in user or not
    let currUser = await User.findById(req.user._id)
    let isFriend = false;
    let requestSent = false;
    if(currUser.friendShip.includes(req.params.id)){
        isFriend = true
    }
    if(currUser.sentFR.includes(req.params.id)){
        requestSent = true
    }
    return res.render('user_profile',{
        profile_user: user,
        person_id: req.params.id,
        no_of_notif:no_of_notif,
        isFriend: isFriend,
        requestSent: requestSent
    });
}

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Profile Updated Succesfully!')
    //         return res.redirect('/');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
               if(err){console.log("----Multer Error: ", err);}
               user.name = req.body.name;
               user.email = req.body.email;
               if(req.file){
                // this is saving the path of the uploaded file in the avatar path
                   user.avatar = User.avatarPath + '/' + req.file.filename;
               }
               user.save();
               return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}

//render signup page
module.exports.signup = function(req, res){
    if(req.isAuthenticated()){
        return res.render('user_profile', {
            profile_user:req.user
        })
    }
    return res.render('sign_up');
}

//render signin page
module.exports.signin = function(req, res){
    if(req.isAuthenticated()){
        return res.render('user_profile',{
            profile_user:req.user
        })
    }
    return res.render('sign_in');
}

// // render forgot-password page
module.exports.forgotpassword = function(req, res){
    return res.render('forgot_pass')
}

module.exports.passwordreset = function(req, res){
    User.findOne({email: req.body.email}, (err, user)=>{
        if(err){console.log("Error in finding User: ", err); return res.render('forgot_pass');}

        // console.log(user);
        if(user){
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            let token = jwt.sign(user.toJSON(), 'daddysboiii', {expiresIn: '1200000'})
            let data = {
                email: req.body.email,
                link: fullUrl+'/'+token
            }
            let job = queue.create('passreset', data).save((err)=>{
                if(err){console.log("error creating a queue!-->", err); return;}
            })

            //creating values in the database
            passSchema.create({
                user: user._id,
                resetlink: token
            })
            req.flash('success', 'Reset link has been sent to registered email!')
            // have to save email somewhere so that it can be used to verify the otp in the database
            return res.redirect('signin');
        }
        else{
            console.log("No User found with that email!");
            return res.redirect('back')
        }
    })
}

//Get the sign up data
module.exports.create = function(req, res){
    if(req.body.password!=req.body.cpassword){
        req.flash('success', 'Passsword not matching!, Please try again.....')
        return res.redirect('back');
    }
    else{
        User.findOne({email:req.body.email}, function(err, user){
        if(err){console.log("Error Signing Up!", err); return;}
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log("Error Creating a user in database!", err); return;}
            })
            req.flash('success', 'You have been signed up successfully!')
            return res.redirect('back');
        }
        if(user){
            req.flash('error', 'Email has been used, Please use another for Singing Up')
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    })
    }
}

//sign in and create session for the user
//here we are making a cookie of user_id in the browser then if password matches then we will call the profile controller 
//where it will see if any user_id is there and finally using that user_id it will findbyId the user from DB and finally render the
//details of the user.

// module.exports.createSession = function(req, res){
//     User.findOne({email:req.body.email}, function(err, user){
//         if(err){console.log("Error Found: ", err); return;}
//         if(user){
//             if(req.body.password==user.password){
//                 res.cookie('user_id', user.id);
//                 return res.redirect('signed_in');
//                 //after this .profile will get called
//             }
//             else if(req.body.password!=user.password){
//                 console.log("Incorrect Password or Username")       
//             }
//             else{
//                 console.log("Unexpected Error Occurred :(")
//             }
//         }
//         else{
//             console.log("User not found");
//         }
//     })
// }


// module.exports.profile = function (req, res) {
//     if (req.cookies.user_id) {
//         User.findById(req.cookies.user_id, function (err, user) {
//             if (err) { console.log("Error Found: ", err); return; }
//             if (user) {
//                 return res.render('signedin', {
//                     user: user
//                 });
//             }
//             else {
//                 console.log("User not found");
//             }
//         })
//     }

// }

module.exports.createSession = function(req, res){
    req.flash('success', 'Logged In Successfully!')
    return res.redirect('/');
}   

module.exports.destroySession = function(req, res){
    
    req.logout();
    req.flash('success', 'Logged Out Successfully!')
    return res.redirect('signin');
}