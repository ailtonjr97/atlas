function confirmation(endereco){
    if(window.confirm ("Deseja realmente inativar esse usuário?") == true){
        return window.location.replace(endereco);
    } else{
        return false
    }
}