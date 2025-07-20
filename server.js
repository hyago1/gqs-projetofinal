// server.js
const app = require('./app'); // Importa a instância do aplicativo Express
const { connectDB } = require('./src/database'); // Importa a função de conexão com a base de dados

const port = process.env.PORT || 3000; // Define a porta do servidor

// Conecta à base de dados e, se for bem-sucedido, inicia o servidor
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Falha ao iniciar o servidor ou conectar à base de dados:", err);
    process.exit(1); // Sai do processo se a conexão falhar
});