// require("dotenv").config(); // Descomente para habilitar variáveis de ambiente, se necessário.
const db = require("./src/config/db.cjs"); // Importa a configuração do banco de dados
const cors = require("cors"); // Importa o middleware CORS

const express = require("express");
const app = express();

const port = process.env.PORT || 3000; // Define a porta para o servidor, utilizando a porta da variável de ambiente ou a porta 3000 como padrão

app.use(express.json()); // Habilita o uso de JSON no corpo das requisições
app.use(cors()); // Habilita CORS para permitir requisições de diferentes domínios

// Rota principal para testar se o servidor está funcionando
app.get("/", (req, res) => res.json({ message: "Funcionando!" }));

// Rota para buscar todos os logins cadastrados
app.get("/logins", async (req, res) => {
  const logins = await db.selectLogins(); // Seleciona todos os logins do banco de dados
  res.json(logins); // Retorna os logins em formato JSON
  console.log(logins); // Exibe os logins no console para debug
});

// Rota para buscar todos os fornecedores cadastrados
app.get("/fornecedor", async (req, res) => {
  const customers = await db.selectCustomers(); // Seleciona todos os fornecedores
  res.json(customers); // Retorna os fornecedores em formato JSON
  console.log(customers); // Exibe os fornecedores no console para debug
});

// Rota para buscar um fornecedor específico pelo ID
app.get("/fornecedor/:id", async (req, res) => {
  const customer = await db.selectCustomer(req.params.id); // Seleciona um fornecedor com base no ID passado na URL
  res.json(customer); // Retorna o fornecedor em formato JSON
  console.log(customer); // Exibe o fornecedor no console para debug
});

// Rota para buscar todos os produtos cadastrados
app.get("/produtos", async (req, res) => {
  try {
    const products = await db.selectProducts(); // Seleciona todos os produtos do banco de dados
    res.json(products); // Retorna os produtos em formato JSON
    console.log(products); // Exibe os produtos no console para debug
  } catch (error) {
    console.error("Erro ao buscar produtos:", error); // Exibe erro no console
    res.status(500).json({ message: "Erro ao buscar produtos" }); // Retorna erro ao cliente
  }
});

// Rota para adicionar um novo produto
app.post("/produtos", async (req, res) => {
  const { nome, descricao, quantidade, preco, categoria } = req.body; // Obtém os dados do corpo da requisição

  // Verifica se todos os campos obrigatórios foram preenchidos
  if (!nome || !descricao || !quantidade || !preco || !categoria) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  try {
    const result = await db.insertProduct(
      nome,
      descricao,
      quantidade,
      preco,
      categoria // Insere o produto no banco de dados
    );
    res
      .status(201)
      .json({ message: "Produto adicionado com sucesso!", produto: result }); // Retorna sucesso e o produto inserido
  } catch (error) {
    console.error("Erro ao adicionar produto:", error); // Exibe erro no console
    res
      .status(500)
      .json({ message: "Erro ao adicionar produto no banco de dados." }); // Retorna erro ao cliente
  }
});

// Rota para autenticação de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Obtém os dados de login do corpo da requisição

  // Verifica se todos os campos foram preenchidos
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, preencha todos os campos" });
  }

  try {
    const user = await db.selectUserByEmail(email); // Seleciona o usuário pelo email

    // Verifica se o usuário existe e se a senha está correta
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // Verifica o status do usuário (admin ou user)
    const userStatus = user.status; // Utiliza a coluna 'status' para identificar o tipo de usuário
    console.log("Status do usuário:", userStatus); // Exibe o status no console para debug

    return res
      .status(200)
      .json({ message: "Login bem-sucedido", status: userStatus }); // Retorna sucesso com o status do usuário
  } catch (error) {
    console.error("Erro ao buscar login:", error); // Exibe erro no console
    return res.status(500).json({ message: "Erro no servidor" }); // Retorna erro ao cliente
  }
});

// Rota para buscar todos os usuários da tabela logins
app.get("/usuarios", async (req, res) => {
  try {
    const result = await db.query("SELECT id, nome, email, status FROM logins"); // Consulta todos os usuários
    res.json(result.rows); // Retorna os usuários em formato JSON
  } catch (error) {
    console.error("Erro ao buscar usuários:", error); // Exibe erro no console
    res.status(500).send("Erro no servidor"); // Retorna erro ao cliente
  }
});

// Inicia o servidor e exibe uma mensagem de confirmação
app.listen(port, () => {
  console.log(`API funcionando na porta ${port}!`); // Exibe no console que o servidor está ativo
});
