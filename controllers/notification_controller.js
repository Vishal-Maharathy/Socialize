const User = require('../models/sign_up')
let io_client = require('socket.io-client')
let socket = io_client('http://localhost:5000')

//loading notification
module.exports.loadNotif = async function(req, res){
    // here you have to make the ajax request to make the div visible and
    // load the contents in it as well
    let sender = await User.findById(req.user.id).populate('pendingFR acceptedFR likeNotif').populate({
        path: 'likeNotif',
        populate: {
            path: 'user'
        }
    })
    let pendingRequests = sender.pendingFR
    let acceptedRequests = sender.acceptedFR
    if(req.xhr){
        return res.json(200, {
            data: {
                currUser: req.user._id,
                pendingFR: pendingRequests,
                acceptedFR: acceptedRequests,
                likeInfo: sender.likeNotif
            },
            message: "Data Recieved Successfully!"
        })
    }
    return res.redirect('back')
}

//sending request to a person
module.exports.sendRequest = async function(req, res){
    let sender = req.user.id
    let accepter = req.params.id
    let sender_db = await User.findById(sender)
    let accepter_db = await User.findById(accepter) 
    sender_db.sentFR.push(accepter)
    sender_db.save()
    accepter_db.pendingFR.push(sender)
    accepter_db.save()
    req.flash('success', "Friend Request Sent!")

    // sending a ping to the acceptor if he/she is online
    socket.emit('notification_ping', {sender: sender, reciever: accepter})
    return res.redirect('back')
}

module.exports.acceptRequest = async function(req, res){
    if(req.query.type == 'accept'){
        let sender = await User.findById(req.query.senderID)
        let accepter = await User.findById(req.query.accepterID)

        sender.acceptedFR.push(accepter._id)
        sender.sentFR.pull(accepter._id)
        sender.friendShip.push(accepter._id)
        sender.save()

        accepter.friendShip.push(sender._id)
        accepter.pendingFR.pull(sender._id)
        // sending a ping to the acceptor if he/she is online
        socket.emit('notification_ping', {sender: sender, reciever: accepter})
        accepter.save()
        if(req.xhr){
            return res.json(200)
        }
    }
    else{
        let sender = await User.findById(req.query.senderID)
        let accepter = await User.findById(req.query.accepterID)
        sender.sentFR.pull(accepter._id)
        sender.save()

        accepter.pendingFR.pull(sender._id)
        accepter.save()
        if(req.xhr){
            return res.json(200)
        }    
    }
}

module.exports.pendingReqClear = async function(req, res){
    let currentUser = await User.findById(req.query.currID)
    currentUser.acceptedFR.pull(req.query.accepterID)
    currentUser.save()
    if(req.xhr){
        return res.json(200)
    }
}

module.exports.likeNotifClear = async function(req, res){
    let user = await User.findById(req.query.currID)
    console.log(req.query.LikeModel)
    user.likeNotif.pull(req.query.LikeModel)
    user.save();
    return res.json(200, {})
}