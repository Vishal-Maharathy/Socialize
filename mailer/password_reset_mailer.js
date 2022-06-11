const nodemailer = require('../config/nodemailer')

// this is another way of exporting a method
exports.resetPassword = (data)=>{

    let htmlString = nodemailer.renderTemplate({link: data.link}, '/password_reset/reset_pass_otp.ejs')

    nodemailer.transporter.sendMail({
        from: 'supmind76@gmail.com',
        to: data.email,
        subject: 'Password Reset',
        html : htmlString
    }, (err, info)=>{
        if(err){
            console.log("Error in sending Mail!", err);return;
        }
        console.log("Mail Delivered-> ", info)
        return
    })
}