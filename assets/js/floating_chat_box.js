let nodeList = document.getElementById('mobile-chat');
let obj = nodeList;
obj.addEventListener('touchmove', function (event) {
    var touch = event.targetTouches[0];
    obj.style.left = eval(touch.clientX + -20) + 'px';
    obj.style.top = eval(touch.clientY -20) + 'px';
    event.preventDefault();
}, false);