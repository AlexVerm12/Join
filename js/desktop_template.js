function showLogout(){
    document.getElementById('popUp').classList.remove('d-none');
}

function closePopup(){
    document.getElementById('popUp').classList.add('d-none');
}

function notClose(event) {
    event.stopPropagation();
}