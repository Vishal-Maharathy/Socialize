{
    // div for updation form
    let updateFormDiv = function(data){
        return `
        <div id="updation-form">
            <form action="/users/update/${data.id}" enctype="multipart/form-data" method="post" id="update-form">
                <input type="text" name="name" placeholder="Your Name" value="${data.name}"  required><br>
                <input type="file" name="avatar" accept="image/*"><br>
                <input type="submit" value="Update">
            </form> 
        </div>
    `}
    // div for posts 

    let loadAvatar = function(post){
        if (!post.user.avatar){
            return `
                <img src="/uploads/users/avatars/profilepic.png" alt="profile pic">
            `
        }
        else{
            return `
                <img src="${post.user.avatar}" alt="profile pic">
            `
        }
    }
    let loadPostImage = function(post){
        if (post.postImage){
            // add div and stuff to make it look good
            return `
                <div class="post-Image-Container">
                <img src="${post.postImage}" alt="Attahcment" class="post-attachment">
                </div>
            `
            }
            else{
                return ``
        }
    }

    let postDiv = function(post){
        return `
        <ul id="post-${ post._id }">
                <div class="box">
                        <div class="avatar-info">
                        <div class="post-avatar">
                            ${loadAvatar(post)}
                        </div>
                        <div class="username-datetime">
                            <div class="avatar-name-post">
                                <a href="/users/profile/${post.user._id}" style="text-decoration: none;">
                                    <small class="post-user-name">${post.user.name }</small>
                                </a>
                            </div>
                            <div class="post-datetime">
                                ${post.createdDate} at ${post.createdTime}
                            </div>
                        </div>            
                                
                    </div>
                    <p id="post-content">${post.content }</p>
                    ${loadPostImage(post)}
                </div>

                <span class="likeToggle">
                    Likes
                </span>
                ${post.likes.length}
            </ul>
        `
    }


    let loadingDiv = `
                    <div class="center">
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                        <div class="wave"></div>
                    </div>
    `

    
    
    let updateButton = $('#update-button')
    // access user defined values in div using this syntax .dataset.nameofvalue
    // updateButton[0].dataset.userid
    try{
        updateButton[0].addEventListener('click',(e)=>{
            e.preventDefault();
            let container = $('#bottom-content')
            container[0].innerHTML = loadingDiv
            $.ajax({
                type: 'post',
                url: '/profilepage/updatedetails',
                data: {'id': updateButton[0].dataset.userid},
                success: function(data){
                    container[0].innerHTML = updateFormDiv(data);
                }
            })
        })
    }
    catch(err){}

    let postsButton = $('#posts-button')
    try{
        postsButton[0].addEventListener('click', function(event){
            event.preventDefault()
            let container = $('#bottom-content')
            container[0].innerHTML = loadingDiv
            $.ajax({
                type: 'post',
                url: '/profilepage/loadPosts',
                data: {'id': postsButton[0].dataset.userid},
                success: (data)=>{
                    container[0].innerHTML = ""
                    for(post of data.posts){
                        container[0].innerHTML += postDiv(post)
                    }
                }
            })
        })  
    }
    catch(err){}
    
    let ifAvatar = function(friend){
        if(friend.avatar){
            return `<img src="${friend.avatar}" alt="Image">`
        }
        else{
            return `
            <img src="/uploads/users/avatars/profilepic.png" alt="Image"></img>
            `
        }
    }

    let friendsDiv = function(friend){
        return `
            <div class="friend-box">
            ${ifAvatar(friend)}                
                <div id="name-field"><div><a href="/users/profile/${friend._id}">${friend.name}</a></div></div>
            </div>                    
        `
    }

    let friendsButton = $('#friends-list')
    try{
        friendsButton[0].addEventListener('click', function(event){
            event.preventDefault()
            let container = $('#bottom-content')
            container[0].innerHTML = loadingDiv
            $.ajax({
                type: 'post',
                url: '/profilepage/loadFriends',
                data: {'id': friendsButton[0].dataset.userid},
                success: (data)=>{
                    container[0].innerHTML = `<div id="friends-listbox"></div>`
                    let innerContainer = $('#friends-listbox')
                    console.log(data.friends)
                    for(friend of data.friends){
                        innerContainer[0].innerHTML += friendsDiv(friend)
                    }
                }
            })
        })  
    }
    catch(err){}
}