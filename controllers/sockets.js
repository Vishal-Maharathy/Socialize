// // SERVER-SIDE SOCKETS

let map_users = new Map();
// map_users.set(123, 'user1')
// map_users.set('user1')
// map_users.delete(123)

// console.log(map_users.has(123))
// console.log(map_users.has('user2'))

module.exports.chatSockets = function(port){
    let io = require('socket.io')(port, {
        cors: {
            // for AWS Server
            // origin: 'http://44.238.38.106:8000 ',

            // for LocalHost
            origin: 'http://localhost:8000 ',
            } 
    });
    io.on('connection', function(socket){


        console.log('new connection recieved: ', socket.id)
        
        socket.on('join_room', function(data){
            socket.join(data.chatroom)
            io.in(data.chatroom).emit('user_joined', data.user_name)
        })
        socket.on('send_message', function(data){
            io.in(data.chatRoom).emit('recieve_message', data);
        })

        // for saving user in the map along with socket ID
        socket.on('sendUserID', function(data){
            // user_ID: self.userID,
            socket.join('onlineOfflineUser')
            map_users.set(socket.id, data.user_ID)
            io.in('onlineOfflineUser').emit('user_online', data.user_ID)
        })

        socket.on('disconnect', function(){
            // for marking user online or offline
            let user_ID = map_users.get(socket.id)
            map_users.delete(socket.id)
            io.in('onlineOfflineUser').emit('user_offline', user_ID)
            // 
        })
    })
}