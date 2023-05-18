function validate(form) {
  if (document.getElementsByName("nome")[0].value == "") {
    alert('O campo "nome" não pode ser vazio');
    return false;
  } else if (document.getElementsByName("codigo")[0].value == "") {
    alert('O campo "código" não pode ser vazio');
    return false;
  } else if (
    document.getElementsById("estoqueminInput").value >
    document.getElementById("estoquemaxInput").value
  ) {
    alert(
      'O campo "Estoque mínimo" não pode ser maior que o campo "Estoque máximo"'
    );
    return false;
  } else {
    return confirm("Você realmente quer cadastrar esse produto?");
    const file = document.querySelector("#file");
    file.addEventListener("change", (e) => {
      // Get the selected file
      const [file] = e.target.files;
      // Get the file name and size
      const { name: fileName, size } = file;
      // Convert size in bytes to kilo bytes
      const fileSize = (size / 1000).toFixed(2);
      // Set the text content
      const fileNameAndSize = `${fileName} - ${fileSize}KB`;
      document.querySelector(".file-name").textContent = fileNameAndSize;
    });
  }
}