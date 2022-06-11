module.exports.loadChatEngine = function(req, res){
    // here we will manage database.....

    //returning to client side
    return res.json(200, {
        currUser: req.query.currUser,
        friendID: req.query.friend
    })
}