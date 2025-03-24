document
  .getElementById("form-produto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const quantidade = document.getElementById("quantidade").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;

    const produto = {
      nome,
      descricao,
      quantidade,
      preco,
      categoria,
    };

    try {
      const response = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar produto");
      }

      const novoProduto = await response.json();
      adicionarProdutoNaTabela(novoProduto); // Função para atualizar a tabela

      alert("Produto adicionado com sucesso!"); // Exibe mensagem de sucesso
      document.getElementById("form-produto").reset();
    } catch (error) {
      alert("Insira todos os campos por favor"); // Exibe mensagem de erro
      console.error("Erro:", error);
    }
  });

async function adicionarProdutoNaTabela() {
  try {
    const response = await fetch("http://localhost:3000/produtos");

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const produtos = await response.json();
    const tabela = document
      .getElementById("tabela-produtos")
      .getElementsByTagName("tbody")[0];

    // Limpa a tabela antes de adicionar novos produtos
    tabela.innerHTML = "";

    produtos.forEach((produto, index) => {
      const novaLinha = tabela.insertRow();
      novaLinha.insertCell(0).innerText = index + 1;
      novaLinha.insertCell(1).innerText = produto.nome;
      novaLinha.insertCell(2).innerText = produto.descricao;
      novaLinha.insertCell(3).innerText = produto.quantidade;
      novaLinha.insertCell(4).innerText = produto.preco;
      novaLinha.insertCell(5).innerText = produto.categoria;

      // Criar o botão "Excluir"
      const btnExcluir = document.createElement("button");
      btnExcluir.innerText = "Excluir";
      btnExcluir.className = "btn btn-danger btn-sm";
      btnExcluir.onclick = () => excluirProduto(produto.id); // Vincula a função de exclusão ao botão

      // Adicionar o botão na célula de ações
      const cellAcoes = novaLinha.insertCell(6);
      cellAcoes.appendChild(btnExcluir);
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// Função para excluir o produto
async function excluirProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    try {
      const response = await fetch(`http://localhost:3000/produtos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Produto excluído com sucesso!");
        carregarProdutos(); // Recarregar produtos após exclusão
      } else {
        alert("Erro ao excluir o produto");
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  }
}

window.onload = adicionarProdutoNaTabela; // Carrega os produtos ao  a página do user
