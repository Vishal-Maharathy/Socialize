const kue = require('kue')
// below is creating jobs
const queue = kue.createQueue();
module.exports = queue;