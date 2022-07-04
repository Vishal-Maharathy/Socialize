{   
    var postID;
    let callNoty = function(message){
        new Noty({
            theme : 'relax' , 
            text: message,
            type: 'success',
            layout : "topRight",
            timeout : 1500
            }).show();
    }
    // for showing loading when post is created
    var loadingDiv = `
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
    //method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostform = $('#new-post-form');
        newPostform.submit(function (e) {
            let form = $('#new-post-form')[0];
            let data = new FormData(form);
            e.preventDefault();
            // code for loading screen
            let loadingPart = $('#post_create_loading');
            loadingPart[0].innerHTML = loadingDiv;            
            // 
            $.ajax({
                type: 'post',
                enctype: 'multipart/form-data',
                data: data,
                processData: false,
                contentType: false,
                // url is action in actual form
                url : '/posts/create',
                // below data is taken from the form and then is sent to the postcontroller as req
                // [[[ first data will be passed from here to the post controller, there new post will be created in the    
                // database then req.xhr will return the post(data returned from post_controller.js) which here will 
                // be prepend to the post list..... ]]]
                // data passed below is not same as above data.....,
                // this data is returned from postController
                success: function (data) {
                    loadingPart[0].innerHTML = '';
                    let newPost = newPostDom(data.data.post, loadAvatar(data.data.post), loadPostImage(data.data.post));
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($('.edit-delete-post', newPost));
                    //call a function to send post_id to the comment page.
                    createComment(data.data.post._id);
                    updateLike();
                    callNoty("Post Created!");
                },
                error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }
    createPost();

    // this function here will initiaise the code for loading avatar while posting on homepage.
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
    let newPostDom = function(post, AvatarDiv, postImage){
        return $(`
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
                <a href="/likes/toggle?type=Post&id=${post._id}" class="create-like" style="text-decoration: none;">
                    ${post.likes.length}
                </a>

                <small>
                        <!-- delete-post-button from tutorial for ajax -->
                        <a class="edit-delete-post" href="posts/destroy/${ post._id }">Delete Post</a>
                </small>

                <!-- creating comments -->
                <div class="post-comments">
                    <form id="post-${post._id}-comments-form" action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Write a comment..." required><br>
                    <label id="upload-comment" for="upload-comment-post"><img src="../uploads/images/uploadImage.png" alt="Image"></label>
                    <input type="file" name="commentImage" id="upload-comment-post">
                    <input type="hidden" name="post" value="<%= post._id %>">
                        </form>
                </div>
                <div class="post-comments-list">
                    <span class="comment-title"> Comments:</span>
                    <ul id="post-comments-${post._id}"></ul>
                </div>
            </ul>
            
        `)
    }
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    callNoty("Post Removed!")
                },
                error: function(error){
                    console.log(error.responseText)
                }
            })
        })
    }
    // comment section
    let createComment = function(id){
        let commentForm = $(`#post-${id}-comments-form`);
        commentForm.submit(function(e){
            e.preventDefault();
            let form = commentForm[0]
            let data = new FormData(form)
            $.ajax({
                type: 'post',
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                data: data,
                url: '/comments/create',
                success : function(data){
                    let commentDom = commentdom(data.data.comment);
                    let currentPost = $(`#post-comments-${id}`);
                    currentPost.append(commentDom);
                    destroyComment();
                    updateLikeComment(id);
                    callNoty('Comment Added')
                },
                error: function (e) {
                    console.log("ERROR : ", e);    
                }
            })
        })
    }
    let commentImage = function(comment){
        if(comment.commentImage){
            return `
            <div id="commentAttach">
                <img src="${comment.commentImage}" alt="Attachment">
            </div>
            `
        }
        else{
            return ''
        }
    }
    let commentdom = function(comment){
        return $(`
            <div id="comment-${comment._id}">
                <span class="commenter">${comment.user.name}</span><span class="comment-content">: ${comment.content}</span><br>
                ${commentImage(comment)}
                <span id="likes">
                    Likes
                </span>
                <a href="/likes/toggle?type=Comment&id=${comment._id}" class="create-like" style="text-decoration: none;">
                    ${comment.likes.length}
                </a>
                <small><a class="edit-delete-comment" href="comments/destroy/${comment._id}">Remove</a><br></small>
                <div id="border"></div>
            </div>
        `)
    }

    var destroyComment = function(){
        //  .commenter is the class for the div of the comment content
        // and when remove button is clicked, it will send the comment id from which we can delete the comment
        let deleteButton = $(`.edit-delete-comment`);
        for(let i=0; i<deleteButton.length; i++){
            deleteButton[i].addEventListener('click', function (e) {
                e.preventDefault();
                $.ajax({
                    type: 'get',
                    url: deleteButton[i].href,
                    data: deleteButton.serialize(),
                    success: function(data){
                        $(`#comment-${data.data.comment_id}`).remove();
                        callNoty('Comment Removed');
                    }
                })
            }, i)
        }
    }
    destroyComment();
    
    var convertToAjaxComment = function(){
        let create_comment = $(`.post-comments>form`);
        for(let i=0; i<create_comment.length; i++){
            let post_id = create_comment[i].id.substring(5,29);
            createComment(post_id);
        }
    }
    convertToAjaxComment();
}