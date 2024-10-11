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
    const response = await fetch("http://localhost:3000/produtos"); // Faz a requisição ao back-end
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos do banco de dados");
    }

    const produtos = await response.json(); // Obtém a lista de produtos do BD

    const tabela = document
      .getElementById("tabela-produtos")
      .getElementsByTagName("tbody")[0];

    // Limpa as linhas antigas da tabela, se necessário
    tabela.innerHTML = "";

    // Itera sobre os produtos retornados e os insere na tabela
    produtos.forEach((produto) => {
      const novaLinha = tabela.insertRow();
      novaLinha.insertCell(0).innerText = produto.nome;
      novaLinha.insertCell(1).innerText = produto.descricao;
      novaLinha.insertCell(2).innerText = produto.quantidade;
      novaLinha.insertCell(3).innerText = produto.preco;
      novaLinha.insertCell(4).innerText = produto.categoria;
    });
  } catch (error) {
    console.error("Erro ao adicionar produtos na tabela:", error);
  }
}

window.onload = adicionarProdutoNaTabela; // Carrega os produtos ao carregar a página
