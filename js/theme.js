function changeTheme(){
    currentTheme = document.getElementById('theme').innerHTML;
    if(currentTheme == '☾'){
        document.getElementById('theme').innerHTML = '&#9788;';
        document.body.style.background = '#1f1f1f';
        document.body.style.color = '#fff';
        document.getElementById('theme-bg').style.background = '#111';
        document.getElementById('theme').style.color = '#fff';
        document.getElementById('theme').style.paddingBottom = '6px';
        // document.getElementById('market-table').classList.remove("table-light")
        document.getElementById('market-table').classList.add("table-dark")
        document.getElementById('market-table-head').classList.remove("thead-light")
    }
    else{
        document.getElementById('theme').innerHTML = '&#9790;';
        document.body.style.background = '#CDE5F7';
        document.body.style.color = '#fff';
        document.getElementById('theme-bg').style.background = '#5578AA';
        document.getElementById('theme').style.color = '#111';
        document.getElementById('theme').style.paddingTop = '3px';
        document.getElementById('theme').style.paddingBottom = '3px';
        document.getElementById('market-table').classList.remove("table-dark")
        // document.getElementById('market-table').classList.add("table-light")
        document.getElementById('market-table-head').classList.add("thead-light")
    }
}