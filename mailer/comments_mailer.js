const nodemailer = require('../config/nodemailer')

// this is another way of exporting a method
exports.newComment = (comment)=>{

    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from: 'supmind76@gmail.com',
        to: comment.post.user.email,
        subject: 'New Comment',
        html : htmlString
    }, (err, info)=>{
        if(err){
            console.log("Error in sending Mail!", err);return;
        }
        console.log("Mail Delivered-> ", info)
        return
    })
}