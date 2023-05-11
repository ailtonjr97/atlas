function validate(endereco) {
    alert(
      "A tabela será atualizada, podendo levar até dois minutos. Favor não fechar a aba do Chrome enquanto o processo é executado. Quando concluído irá aparecer uma mensagem de sucesso ou de erro."
    );
    document.getElementById('loading').style.display = 'block';
    return window.location.replace(endereco);
  }