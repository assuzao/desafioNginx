const express = require('express');
const mysql = require('mysql');
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

// Configuração do MySQL
const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
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

// Rota para fazer o SELECT no MySQL
app.get('/', (req, res) => {
    

    const nomeSorteado = sortearNome();
    const pessoa = { name: nomeSorteado };
    connection.query("INSERT INTO people (name) values('"+ nomeSorteado +"')",  (error, results) => {
        if (error) {
            console.error('Erro ao inserir dados: ' + error.stack);
            return res.status(500).send('Erro ao inserir dados no banco de dados.');
        }
    });


    connection.query('SELECT * FROM people', (error, results, fields) => {
        if (error) throw error;


        let html = '<h1>Full Cycle Rocks!</h1> <h1>Resultados da Consulta</h1><table border="1"><tr><th>ID</th><th>Nome</th></tr>';
        results.forEach(result => {
            html += `<tr><td>${result.id}</td><td>${result.name}</td></tr>`;
        });
        html += '</table>';

        // Exibe a tabela na resposta HTTP
        res.send(html);


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

