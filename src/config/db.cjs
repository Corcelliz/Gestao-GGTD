// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

// Função de conexão com o banco de dados PostgreSQL
async function connect() {
  // Verifica se já existe uma conexão global para evitar múltiplas conexões
  if (global.connection) return global.connection;

  const { Pool } = require("pg");

  // Verifica se a string de conexão está definida no .env
  if (!process.env.CONNECTION_STRING) {
    throw new Error("CONNECTION_STRING não definida no .env");
  }

  console.log("String de conexão:", process.env.CONNECTION_STRING); // Para depuração

  // Cria um pool de conexões com o PostgreSQL
  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
  });

  try {
    // Tenta conectar ao banco de dados
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");

    // Executa uma query simples para testar a conexão
    const res = await client.query("SELECT NOW()");
    console.log("Hora atual no PostgreSQL:", res.rows[0]);

    // Libera o cliente de volta ao pool e salva a conexão globalmente
    client.release();
    global.connection = pool;
    return pool;
  } catch (error) {
    console.error("Erro ao conectar no PostgreSQL:", error);
    throw error;
  }
}

connect(); // Chama a função de conexão ao iniciar

// Função para inserir um produto no banco de dados
async function insertProduct(nome, descricao, quantidade, preco, categoria) {
  const client = await connect(); // Conecta ao banco
  const query = `
    INSERT INTO produtos (nome, descricao, quantidade, preco, categoria)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`; // Query de inserção
  const values = [nome, descricao, quantidade, preco, categoria]; // Parâmetros da query

  try {
    const result = await client.query(query, values); // Executa a query
    return result.rows[0]; // Retorna o produto inserido
  } catch (error) {
    console.error("Erro ao inserir produto:", error);
    throw error;
  }
}

// Função para selecionar todos os produtos
async function selectProducts() {
  const client = await connect(); // Conecta ao banco
  const res = await client.query("SELECT * FROM produtos"); // Executa a query de seleção
  return res.rows; // Retorna todos os produtos
}

// Função para selecionar todos os fornecedores
async function selectCustomers() {
  const client = await connect(); // Conecta ao banco
  const res = await client.query("SELECT * FROM fornecedor"); // Executa a query de seleção
  return res.rows; // Retorna todos os fornecedores
}

// Função para selecionar um fornecedor específico pelo ID
async function selectCustomer(id) {
  const client = await connect(); // Conecta ao banco
  const res = await client.query("SELECT * FROM fornecedor WHERE ID=$1", [id]); // Executa a query com o ID
  return res.rows; // Retorna o fornecedor correspondente
}

// Função para selecionar um usuário pelo email (usado no login)
async function selectUserByEmail(email) {
  const client = await connect(); // Conecta ao banco
  const query = `SELECT * FROM logins WHERE email = $1`; // Query de seleção de login
  const values = [email]; // Parâmetro de email

  try {
    const result = await client.query(query, values); // Executa a query
    return result.rows[0]; // Retorna o primeiro usuário encontrado
  } catch (error) {
    console.error("Erro ao buscar login:", error);
    throw error;
  }
}

// Função para selecionar todos os logins
async function selectLogins() {
  const client = await connect(); // Conecta ao banco
  const res = await client.query("SELECT * FROM logins"); // Executa a query de seleção
  return res.rows; // Retorna todos os logins
}

// Exporta as funções para serem utilizadas em outros módulos existentes
module.exports = {
  selectCustomers,
  selectCustomer,
  insertProduct,
  selectProducts,
  selectUserByEmail,
  selectLogins,
};
