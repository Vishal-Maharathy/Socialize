// CLIENT-SIDE SOCKET


class chatEngine{
    constructor(chatBoxId, userName, userID){
        this.chatBox = $(`#${chatBoxId}`)
        this.userName = userName
        this.userID = userID
        // for AWS server
        // this.socket = io('http://44.238.38.106:5000')

        // for LocalHost
        this.socket = io('http://localhost:5000')

        // calling method for setting up connection with server
        this.connectionHandler()
    }
    connectionHandler(){
        var self = this
        this.socket.on('connect', function(){
            console.log("Connection Established using sockets!")
            
            self.socket.emit('join_room', {
                user_name: self.userName,
                chatroom: 'commonRoom'
            })
            self.socket.on('user_joined', function(data){
                console.log("User Joined: ", data)
            })
            self.socket.emit('sendUserID', {
                user_ID: self.userID
            })
            // this is for checking who is online for setting up the first time when user loads the page
            // we will recieve a map here which will contain the online_users list
            self.socket.emit('getOnlineUsers');
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
        })


        self.socket.on('usersOnlineList', function(arrayUsers){
            let map = new Map()
            for(let i of arrayUsers){
                map.set(i);
            }
            let friends_list_box = $('#friends-list>ul>a')
            for(let friend of friends_list_box){
                if(map.has(friend.dataset.friendid)){
                    // put the online div here
                    // friend.innerHTML = 'Online'
                    friend.querySelector('#user-offline-dot').style.display = 'inline-block'
                    friend.querySelector('#user-online-dot').style.display = 'none'
                }else{
                    friend.querySelector('#user-online-dot').style.display = 'inline-block'
                    friend.querySelector('#user-offline-dot').style.display = 'none'
                }
            }
        })
        self.socket.on('user_online', function(userID){
            let friends_list_box = $('#friends-list>ul>a')
            for(let friend of friends_list_box){
                if(friend.dataset.friendid==userID){
                    // put the online div here
                    // friend.innerHTML = 'Online'
                    friend.querySelector('#user-offline-dot').style.display = 'inline-block'
                    friend.querySelector('#user-online-dot').style.display = 'none'
                }
            }
        })
        self.socket.on('user_offline', function(userID){
            let friends_list_box = $('#friends-list>ul>a')
            for(let friend of friends_list_box){
                if(friend.dataset.friendid==userID){
                    friend.querySelector('#user-online-dot').style.display = 'inline-block'
                    friend.querySelector('#user-offline-dot').style.display = 'none'
                }
            }
        })
        self.socket.on('notification_recieve', function(data){
            // this will call callNotif function in notification.js
            callNotif();
        })
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