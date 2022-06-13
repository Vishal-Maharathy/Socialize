{
    let updateFormDiv = function(data){
        return `
        <div id="updation-form">
            <form action="/users/update/${data.id}" enctype="multipart/form-data" method="post" id="update-form">
                <input type="text" name="name" placeholder="Your Name" value="${data.name}"  required><br>
                <input type="file" name="avatar"><br>
                <input type="submit" value="Update">
            </form> 
        </div>
    `}

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