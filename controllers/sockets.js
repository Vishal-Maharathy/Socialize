// // SERVER-SIDE SOCKETS

// let onlineUsers = [{}]

// module.exports.EstablishSocket = function(port){
//     let io = require('socket.io')(port, {
//         cors: {
//             origin: 'http://localhost:8000',
//           }        
//     })
//     io.on('connection', function(socket){
//         // this is for adding to online users array
//         socket.on('user-online', function(data){
//             if(onlineUsers.find(x=>x.userID!=data.userID)){
//                 let user = {
//                     userName: data.userName,
//                     userID: data.userID,
//                     socketID: socket.id
//                 }
//                 onlineUsers.push(user);
//             }
//         })
//         console.log('new connection recieved with ID: ', socket.id)

//         socket.on('disconnect', function(){
//             console.log('Socket disconnected! with ID: ', socket.id)
//             // this is for removing from the online users array
//             onlineUsers = onlineUsers.filter(x=>x.socketID!=socket.id)
//         })

//         socket.on('connect-room', function(roomName){
//             socket.join(roomName);
//             socket.broadcast.emit(roomName, `Connected to Room: ${roomName}`)
//         })
//         // here send the message and the room name to send the message
//         socket.on('send-message', function(data){
//             socket.emit(data.room, data.msg);
//         })
//     })
// }

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://44.238.38.106:8000',
            } 
    });
    io.on('connection', function(socket){
        console.log('new connection recieved: ', socket.id)

        socket.on('disconnect', function(){
            console.log('Socket disconnected: ', socket.id)
        })
        socket.on('join_room', function(data){
            socket.join(data.chatroom)
            io.in(data.chatroom).emit('user_joined', data.user_name)
        })
        socket.on('send_message', function(data){
            io.in(data.chatRoom).emit('recieve_message', data);
        })
    })
}