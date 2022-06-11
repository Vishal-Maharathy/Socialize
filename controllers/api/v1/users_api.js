const User = require('../../../models/sign_up');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment')



module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid Username or Password!"
            })
        }
        return res.json(200, {
            messgae: "Sign in Successfull, here is your token, please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(), env.jwtSecretKey, {expiresIn: '600000'})
            }
        })
    }
    catch(err){
        return res.json(500,{
            messgae: "Internal Server Error!--> " + err
        })
    }
}  