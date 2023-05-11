function validate(endereco) {
    alert(
      "Tabela será atualizada, podendo levar até dois minutos. Favor não fechar a aba do Chrome enquanto o processo é executado. Quando concluído irá aparecer uma mensagem de sucesso ou de erro."
    );
    return window.location.replace(endereco);
    ///produtos/atualizar
  }