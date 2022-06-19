{
    let createLike = function () {
        let likeSection = $('.create-like');
        for (let i = 0; i < likeSection.length; i++) {
            likeSection[i].addEventListener('click', function (e) {
                e.preventDefault();
                $.ajax({
                    type: 'post',
                    url: likeSection[i].href,
                    success: function (data) {
                        let number = parseInt(likeSection[i].innerHTML)
                        if(data.data.ifDeleted){
                            // window.alert("like REDUCED")
                            likeSection[i].innerHTML = number-1
                            likeSection[i].style.color = "rgb(105, 109, 114)"
                        }
                        else{
                            // window.alert("like INCREASED")
                            likeSection[i].innerHTML = number+1
                            likeSection[i].style.color = "#00ff40"

                            // call likeNotification in notification.js
                            likeNotification(data.data);
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                })
            })
        }
    }
    createLike();

    // for setting up like when posting a new post, that time an event listener must be added
    var updateLike = function(){
        let likeSection = $('.create-like');
        likeSection[0].addEventListener('click', function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: likeSection[0].href,
                success: function (data) {
                    if(data.data.ifDeleted){
                        // window.alert("like REDUCED")
                        likeSection[0].innerText = " "+data.data.nums
                        likeSection[0].style.color = "rgb(105, 109, 114)"
                    }
                    else{
                        // window.alert("like INCREASED")
                        likeSection[0].innerText = " "+data.data.nums
                        likeSection[0].style.color = "#00ff40"
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            })
        })
    }
    var updateLikeComment = function(id){
        let comment = $(`#post-comments-${id}>div:last-child>a`)
        // console.log(comment)
        comment[0].addEventListener('click', function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: comment[0].href,
                success: function (data) {
                    if(data.data.ifDeleted){
                        // window.alert("like REDUCED")
                        comment[0].innerText = " "+data.data.nums
                        comment[0].style.color = "rgb(105, 109, 114)"
                    }
                    else{
                        // window.alert("like INCREASED")
                        comment[0].innerText = " "+data.data.nums
                        comment[0].style.color = "#00ff40"
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            })
        })
    }

    // show likes when clicking on like
    var likeList = function(){
        let likes = $('.likeToggle');
        for(let i=0; i<likes.length; i++){
            likes[i].addEventListener('click', function(e){
                e.preventDefault();
                $.ajax({
                    type: 'post',
                    url: likes[i].href,
                    success: function(data){
                        let contentBox = $(".modal-content>p")
                        console.log(contentBox)
                        contentBox[0].innerHTML = ""
                        contentBox[0].innerHTML = "<h1 class="+"modal-heading"+">Likes</h1>"
                        for(x of data.data.names){
                            contentBox[0].innerHTML+="<ul>"+x+"</ul>"
                        }
                        modal.style.display = "block";
                    }
                })
            })
        }
    }
    likeList()
    
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
}