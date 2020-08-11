function changeTheme(){
    currentTheme = document.getElementById('theme').innerHTML;
    if(currentTheme == '☾'){
        document.getElementById('theme').innerHTML = '&#9788;';
        document.body.style.background = '#111';
        document.body.style.color = '#fff';
        document.getElementById('theme').style.color = '#fff';
        document.getElementById('theme').style.paddingBottom = '6px';
        document.getElementById('market-table').classList.add("table-dark")
    }
    else{
        document.getElementById('theme').innerHTML = '&#9790;';
        document.body.style.background = '#cde5f7';
        document.body.style.color = '#111';
        document.getElementById('theme').style.color = '#111';
        document.getElementById('theme').style.paddingTop = '3px';
        document.getElementById('theme').style.paddingBottom = '3px';
        document.getElementById('market-table').classList.remove("table-dark")
    }
}