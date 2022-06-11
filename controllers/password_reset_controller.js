const User = require('../models/sign_up');
const passSchema = require('../models/password_reset')
const jwt = require('jsonwebtoken')
const env = require('../config/environment')

module.exports.resetPassword = function(req, res){
    let token = req.params.token
    let finalSchema;
    //Here I have return res.redirect insisde the mongoos code still works,
    //but in case of signing up, it doesn't.
    passSchema.find({}).populate('user').findOne({resetlink:token}, function(err, schema){
        if(err){console.log("Error while finding password schema ", err);return res.redirect('/')}

        if(schema){
            finalSchema = schema
            return res.redirect('/setPass/' + token)
        }
        else{
            req.flash('success', 'Session expired, please try again')
            console.log("Schema is not present or must have expired!")
            return res.redirect('/')
        }
    })
}
module.exports.setPass = function(req, res){
    console.log(req.params.token);
    res.render('reset_pass', {token: req.params.token});
}
module.exports.updatePass = function(req, res){
    let data = jwt.verify(req.params.token, env.jwtSecretKey)
    User.findOneAndUpdate({_id: data._id}, {password: req.body.password}, function(err, user){
        if(err){console.log("error in updating password!"); return;}
        if(!user){
            req.flash('error', 'failed to update password');
            return res.redirect('/')
        }
    });
    req.flash('success', 'Password changed succesfully!')
    return res.redirect('/');
}