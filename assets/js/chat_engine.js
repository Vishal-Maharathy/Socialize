// CLIENT-SIDE SOCKET

class chatEngine{
    constructor(chatBoxId, userName){
        this.chatBox = $(`#${chatBoxId}`)
        this.userName = userName
        this.socket = io('http://44.238.38.106:5000')
        if(this.userName){
            this.connectionHandler()
        }
    }
    connectionHandler(){
        let self = this
        this.socket.on('connect', function(){
            console.log("Connection Established using sockets!")
            
            self.socket.emit('join_room', {
                user_name: self.userName,
                chatroom: 'commonRoom'
            })
            self.socket.on('user_joined', function(data){
                console.log("User Joined: ", data)
            })

        })

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if(msg!=''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_name: self.userName,
                    chatRoom: 'commonRoom'
                })
                $('#chat-message-input')[0].value = ''
            }
        })

        self.socket.on('recieve_message', function(data){
            console.log('message recieved', data)
            let newMessage = $('<li>');

            let messageType = 'other-message';

            if(data.user_name == self.userName){
                messageType = 'self-message'
            }
            newMessage.append($('<span>', {
                'html': data.message
            }))
            newMessage.append($('<sub>', {
                'html': data.user_name
            }))
            newMessage.addClass(messageType)
            $('#chat-messages-list').append(newMessage)
            console.log(newMessage)
        })
        // whenever a new user is registered, it will get updtaed in the onlineUsers array on the server side
        // this.socket.emit('user-online', {
        //     userName: this.userName,
        //     userID: this.userID
        // })
    }

}

{
    let floatingChat = $('#mobile-chat')
    floatingChat[0].addEventListener('click', function(e){
        // then make the div visible
        let chatBox = $(`#user-chat-box`)
        if(chatBox[0].style.visibility=='visible'){
            chatBox[0].style.visibility = 'hidden'
            chatBox[0].style.height = '0px'
            chatBox[0].style.width = '0px'
        }
        else{
            chatBox[0].style.visibility = "visible"
            chatBox[0].style.height = '60vh'
            chatBox[0].style.width = '90vw'
            
        }
    })
}
// for mobile
{
    let messengerOptions = $('#chat-options')
    messengerOptions[0].addEventListener('click', function(e){
        // then make the div visible
        let chatBox = $(`#user-chat-box`)
        let x = window.matchMedia("(max-width: 750px)")
        if(chatBox[0].style.visibility=='visible'){
            chatBox[0].style.visibility = 'hidden'
            chatBox[0].style.height = '0px'
            chatBox[0].style.width = '0px'
        }
        else{
            chatBox[0].style.visibility = "visible"
            if(x.matches){
                chatBox[0].style.height = '60vh'
                chatBox[0].style.width = '87vw'
            }
            else{
                chatBox[0].style.height = '497px'
                chatBox[0].style.width = '408px'
            }
            
        }
    })
}

// // using ajax i can recieve the room name and here i can pass the room name to the server{just an example}
// // let chat_Engine = function(roomName){
// //     const chatSocket = io('http://localhost:5000')
// //     chatSocket.emit('connect-room', roomName)
// //     chatSocket.on('connect-room', function(data){
// //         console.log(data);
// //     })
// //     chatSocket.emit('send-message', {room:'bruh', msg:'Hello Niggers'})
// //     chatSocket.on('bruh', function(msg){
// //         console.log(msg);
// //     })
// // }
// // chat_Engine('bruh');


// // for opening different options when user clicks on messenger
// {
//     let messengerOptions = $('#chat-options')
//     messengerOptions[0].addEventListener('click', function(e){
//         let chatOptions = $(`.chat-options-list`)
//         // then make the div visible
//         if(chatOptions[0].style.visibility=='visible'){
//             chatOptions[0].style.visibility = 'hidden'
//             chatOptions[0].style.height = '0px'
//         }
//         else{
//             chatOptions[0].style.visibility = "visible"
//             chatOptions[0].style.height = "200px"
//         }
//     })
// }
// {
//     let friends = $(`#chat-options-list>ul>a`)
//     console.log(friends);
//     for(friend of friends){
//         friend.addEventListener('click', function(e){
//             e.preventDefault()
//             console.log(e.srcElement.href)
//             $.ajax({
//                 type: 'get',
//                 url: e.srcElement.href,
//                 success: function (data) {
//                     console.log(data.currUser, data.friendID);
//                     let chatBox = $(`#user-chat-box`)
//                     chatBox[0].style.visibility = 'visible'
//                     let privateChat = io('http://localhost:5000');
//                     privateChat.on('connect', function(){
//                         console.log('chat connection established')
//                     })
//                     privateChat.emit('send-msg', {
//                         user_id: data.currUser,
//                         friend_id: data.friendID
//                     })
//                 },
//                 error: function (error) {
//                     console.log(error);
//                 }
//             })
//         })
//     }
// }