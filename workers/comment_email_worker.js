// const queue = require('../config/kue')
// const commentsMailer = require('../mailer/comments_mailer')
// const passReset = require('../mailer/password_reset_mailer')

// //this function will get executed if there is a job in the queue. This will get the job from the comments_controller
// queue.process('emails', (job, done)=>{
//     // console.log("emails worker is processing a job in queue! with data--> ", job.data)
//     commentsMailer.newComment(job.data);
//     done();
// })