{
    // accept reject link setter for ajax
    let linkSetterAccnRej = function(){
        let listLinks = $('.link-set-AccnRej')
        for(let i = 0; i<listLinks.length; i++){
            listLinks[i].addEventListener('click', function(e){
                e.preventDefault()
                $.ajax({
                    type: 'get',
                    url: listLinks[i].href,
                    success: function (data) {
                        let element = listLinks[i].parentNode.parentNode
                        element.parentNode.removeChild(element); 
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            })
        }
    }
    let linkSetterPendReq = function(){
        let listLinks = $('.link-set-ReqAccepted')
        for(let i = 0; i<listLinks.length; i++){
            listLinks[i].addEventListener('click', function(e){
                e.preventDefault()
                $.ajax({
                    type: 'get',
                    url: listLinks[i].href,
                    success: function (data) {
                        let element = listLinks[i].parentNode.parentNode
                        element.parentNode.removeChild(element); 
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            })
        }
    }
    let notificationLoader = function(){
        let notifDiv = $('#notification-box');
        let notifButton = $('.notification');
        notifButton.click(function(e){
            var x = window.matchMedia("(max-width: 750px)") 
            if(notifDiv[0].style.visibility == 'visible'){
                notifDiv[0].style.visibility = 'hidden'
                notifDiv[0].style.height = '1px'
                notifDiv[0].style.width = '1px'
                notifDiv[0].style.transition = '.3s ease-out'
            }else{
                if(x.matches){
                    notifDiv[0].style.height = '30vh'
                    notifDiv[0].style.width = '50vw'
                }
                else{
                    notifDiv[0].style.height = '30vh'
                    notifDiv[0].style.width = '60vh'
                }
                notifDiv[0].style.visibility = 'visible'
                notifDiv[0].style.transition = '.3s ease-out'
            }
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: notifButton[0].href,
                success: function (data) {
                    notifDiv[0].innerHTML = "<h2>Notifications</h2>"
                    if(data.data.pendingFR.length==0){
                        notifDiv[0].innerHTML+= "<h3>No Pending Requests</h3>"
                    }
                    else{
                        for(i of data.data.pendingFR){
                            notifDiv[0].innerHTML+=htmlPending(i.name, data.data.currUser, i._id)
                        }
                    }
                    if(data.data.acceptedFR.length==0){
                        notifDiv[0].innerHTML+= "<h3>No Other Notifications</h3>"
                    }
                    else{
                        for(i of data.data.acceptedFR){
                            notifDiv[0].innerHTML+=htmlAccepted(i.name, data.data.currUser, i._id)
                        }
                    }
                    linkSetterAccnRej()
                    linkSetterPendReq()
                },
                error: function (error) {
                    console.log(error);
                }
            })
        })
    }
    notificationLoader();
// to delete the div after accepting or rejecting a request, use .parentNode 
// to select the parent div and remove it
    let htmlPending = function(data, accepter, senderID){
        return `
        <ul>
            <p>Friend Request: <a href="/users/profile/${senderID}">${data}</a></p><br>
            <div id="acceptRejectPanel">
                <a class="link-set-AccnRej" href="/notifications/requests/acceptnreject?senderID=${senderID}&accepterID=${accepter}&type=accept">Accept</a>
                <a class="link-set-AccnRej" href="/notifications/requests/acceptnreject?senderID=${senderID}&accepterID=${accepter}&type=reject">Reject</a>
            </div>
        </ul>
        `
    }
    let htmlAccepted = function(accepterName, currUser, accepterID){
        return `
        <ul>
            <p><a href="/users/profile/${accepterID}">${accepterName}</a> has accepted your friend request</p>
            <div id="PendingClearPanel">
                <a class="link-set-ReqAccepted" href="/notifications/requests/pendingReqClear?accepterID=${accepterID}&currID=${currUser}">Clear</a>
            </div>
        </ul>
        `
    }
}