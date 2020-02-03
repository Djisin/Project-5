
let orderP = document.getElementById('order-id-p')
let orderId = localStorage.getItem('orderId')
localStorage.removeItem('orderId')
orderP.innerText = orderId;
localStorage.clear();
setTimeout(function(){
    window.location.href = '/list-view.html';
 }, 10000);