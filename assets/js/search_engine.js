{
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

    let search_button = $('#search-button')
    let userID = search_button[0].dataset.userid
    search_button[0].addEventListener('click', function(event){
        event.preventDefault();
        let searchBox = $('#search-box');
        console.log("BRUH")
        if(searchBox[0].style.visibility == 'visible'){
            searchBox[0].style.visibility = 'hidden'
            searchBox[0].style.opacity = '0%'
        }
        else{
            searchBox[0].style.visibility = 'visible'
            searchBox[0].style.opacity = '100%'
        }
    })

    let userListDiv = (user)=>{
        return `
        <ul><a href="/users/profile/${user._id}">${user.name}</a></ul>
        `
    }
    let noresult = ()=>{
        return `
        <ul>No results found 😅, try searching the name of the person...</ul>
        `
    }
    let searchInput = $('#search-box>input')
    searchInput[0].addEventListener('keypress', (event)=>{
        let search_term = searchInput[0].value.trim()
        let container = $('#search-box>#container');
        if(event.key=="Enter"){
            container[0].innerHTML = loadingDiv;
            $.ajax({
                method: 'post',
                data: {
                    userID: userID,
                    searchUser: search_term
                },
                url: '/searchEngine',
                success: (data)=>{
                    container[0].innerHTML = ''
                    if(data.users.length == 0){
                        container[0].innerHTML = noresult();
                    }
                    for(user of data.users){
                        container[0].innerHTML += userListDiv(user)
                    }
                }
            })
        }
        
    })

    // for desktop
    let searchInputD = $('#searchBox-D>input')
    searchInputD[0].addEventListener('keypress', (event)=>{
        let search_term = searchInputD[0].value.trim()
        let container = $('#container-searches-D');
        if(event.key=="Enter"){
            container[0].style.height = '230px'
            container[0].innerHTML = loadingDiv;
            $.ajax({
                method: 'post',
                data: {
                    userID: userID,
                    searchUser: search_term
                },
                url: '/searchEngine',
                success: (data)=>{
                    container[0].innerHTML = '<ul id="close-searchBox">Close</ul>'
                    if(data.users.length == 0){
                        container[0].innerHTML = noresult();
                    }
                    for(user of data.users){
                        container[0].innerHTML += userListDiv(user)
                    }
                    createCloseButton();
                }
            })
        }
    })
    let createCloseButton = function(){
        let closeSearchBox = $('#close-searchBox')
        closeSearchBox[0].style.color = '#9a25af'
        closeSearchBox[0].addEventListener('click', (event)=>{
        event.preventDefault();
        let container = $('#container-searches-D');
        container[0].style.height = '0px'
    })
    }
}