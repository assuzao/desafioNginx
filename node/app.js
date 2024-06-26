const express = require('express');
const mysql = require('mysql');
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

// Configuração do MySQL
const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb',
    port: '3306'
});

// Conectar ao MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ' + err.stack);
        return;
    }
    console.log('Conectado ao MySQL como ID ' + connection.threadId);
});

// Configuração do Express
const app = express();
const port = 3000;

// Rota para fazer o SELECT no MySQL e inserir dados
app.get('/', (req, res) => {
    const nomeSorteado = sortearNome();

    // Inserir dados na tabela 'people' usando consulta parametrizada
    connection.query('INSERT INTO people (name) VALUES (?)', [nomeSorteado], (error, results) => {
        if (error) {
            console.error('Erro ao inserir dados: ' + error.stack);
            return res.status(500).send('Erro ao inserir dados no banco de dados.');
        }

        // Selecionar todos os registros da tabela 'people'
        connection.query('SELECT * FROM people', (error, results, fields) => {
            if (error) {
                console.error('Erro ao consultar dados: ' + error.stack);
                return res.status(500).send('Erro ao consultar dados no banco de dados.');
            }

            // Construir resposta HTML com os resultados da consulta
            let html = '<h1>Full Cycle Rocks!</h1><h2>Resultados da Consulta</h2><table border="1"><tr><th>ID</th><th>Nome</th></tr>';
            results.forEach(result => {
                html += `<tr><td>${result.id}</td><td>${result.name}</td></tr>`;
            });
            html += '</table>';

            // Enviar resposta HTTP com a tabela HTML
            res.send(html);
        });
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

function sortearNome() {
    const nomes = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace']; // Array de nomes

    const indiceSorteado = Math.floor(Math.random() * nomes.length); // Gera um índice aleatório
    return nomes[indiceSorteado]; // Retorna o nome sorteado
}

