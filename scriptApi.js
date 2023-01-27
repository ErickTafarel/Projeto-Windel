const url = "https://windelweb.windel.com.br:3000/teste-front"
// Get references to the form elements
const inputNome = document.getElementById("inputNome");
const inputValor = document.getElementById("inputValor");
const inputReferencia = document.getElementById("inputReferencia");
const inputUnidade = document.getElementById("inputUnidade");
const inputFabricante = document.getElementById("inputFabricante");
const inputEstoque = document.getElementById("inputEstoque");
const inputImagem = document.getElementById("inputImagem");
const buttonSave = document.getElementById("button-save");
const buttonErase = document.getElementById("button-erase");

// Evento ao clicar botão limpar campos
buttonErase.addEventListener("click", function(){
  clearFields()
})

// Função limpar campos

function clearFields() {
  inputNome.value = "";
  inputValor.value = "";
  inputReferencia.value = "";
  inputUnidade.value = "";
  inputFabricante.value = "";
  inputEstoque.value = "";
  inputImagem.value = "";
}

// Evento ao clicar botão salvar

buttonSave.addEventListener("click", function() {
  if (inputNome.value == "" || inputValor.value == "" || inputReferencia.value == "" || inputUnidade.value == "" || inputFabricante.value == "" || inputEstoque.value == "") {
  alert("Todos os campos são obrigatórios!");
  return;
  }
  
  let data = {
  nome: inputNome.value,
  valorVenda: inputValor.value,
  referencia: inputReferencia.value,
  unidadeMedida: inputUnidade.value,
  fabricante: inputFabricante.value,
  estoque: inputEstoque.value,
  imagemProduto: inputImagem.value
  }

  data.valorVenda = parseFloat(data.valorVenda);
  data.estoque = parseInt(data.estoque);
  
  axios.post(url, data)
  .then(response => {
  console.log(response);
  clearFields();
  displayData();
  })
  .catch(error => console.log.error)
  }
)

// Função para mostrar os produtos

function displayData() {
  let container = document.querySelector("#info-show-element");
  while (container.firstChild) {
      container.removeChild(container.firstChild);
  }
  axios.get(url)
  .then(response => {
    let data = response.data;
    for (let i = 0; i < data.length; i++) {
        let dataContainer = document.createElement("tr");
        dataContainer.classList.add("data-container");

        let imgTD = document.createElement("td");
        let img = document.createElement("img");
        imgTD.classList.add("img-products");
        img.src = response.data[i].imagemProduto; // alterar para o campo correto da API
        imgTD.appendChild(img);
        dataContainer.appendChild(imgTD);

        let nomeTD = document.createElement("td");
        nomeTD.innerHTML = response.data[i].nome; // alterar para o campo correto da API
        dataContainer.appendChild(nomeTD);

        let referenciaTD = document.createElement("td");
        referenciaTD.innerHTML = response.data[i].referencia; // alterar para o campo correto da API
        dataContainer.appendChild(referenciaTD);

        let valorTD = document.createElement("td");
        valorTD.innerHTML ="R$ " + response.data[i].valorVenda; // alterar para o campo correto da API
        Number.parseFloat(valorTD);
        dataContainer.appendChild(valorTD);

        let fabricanteTD = document.createElement("td");
        fabricanteTD.innerHTML = response.data[i].fabricante;
        dataContainer.appendChild(fabricanteTD);

        if(response.data[i].estoque > 0){
          let estoqueUnidadeTD = document.createElement("td");
          estoqueUnidadeTD.innerHTML = response.data[i].estoque + " " + response.data[i].unidadeMedida;
          dataContainer.appendChild(estoqueUnidadeTD);
        } else {
          estoqueUnidadeTD = document.createElement("td");
          estoqueUnidadeTD.classList.add("esgotado");
          estoqueUnidadeTD.innerHTML = "esgotado";
          dataContainer.appendChild(estoqueUnidadeTD)
        }

        let trashTD = document.createElement("a");
        trashTD.classList.add("trash-a")
        trashTD.innerHTML = `<svg class="trash-svg" width="19" height="26" viewBox="0 0 19 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.2083 5H15.0417V2.5C15.0417 1.39688 14.3316 0.5 13.4583 0.5H5.54167C4.66836 0.5 3.95833 1.39688 3.95833 2.5V5H0.791667C0.353776 5 0 5.44687 0 6V7C0 7.1375 0.0890625 7.25 0.197917 7.25H1.69219L2.30326 23.5938C2.34284 24.6594 3.04049 25.5 3.88411 25.5H15.1159C15.962 25.5 16.6572 24.6625 16.6967 23.5938L17.3078 7.25H18.8021C18.9109 7.25 19 7.1375 19 7V6C19 5.44687 18.6462 5 18.2083 5ZM13.2604 5H5.73958V2.75H13.2604V5Z" fill="#E53E3E"/>
        </svg>`;
        dataContainer.appendChild(trashTD);

        trashTD.addEventListener("click", function() {
          // Encontre o id do produto clicado
          let id = response.data[i].id;
          // Faça uma chamada axios.delete para apagar o produto da API
          axios.delete(`${url}/${id}`)
            .then(response => {
              displayData();
            })
            .catch(error => console.log(error))
        });
        document.querySelector("#info-show-element").appendChild(dataContainer);
    }
  }
  )
}

displayData();