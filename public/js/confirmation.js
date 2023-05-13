function confirmation(mensagem, endereco){
    if(window.confirm (mensagem) == true){
        document.getElementById('loading').style.display = 'block';
        return window.location.replace(endereco);
    } else{
        return false
    }
}