// const queue = require('../config/kue')
// const passReset = require('../mailer/password_reset_mailer')

// // queue.process('emails', (job, done)=>{
// //     // console.log("emails worker is processing a job in queue! with data--> ", job.data)
// //     commentsMailer.newComment(job.data);
// //     done();
// // })

// queue.process('passreset', (job, done)=>{
//     console.log("Processing sending OTP from queue.process! with job as --> ", job.data)
//     passReset.resetPassword(job.data);
//     done();
// })