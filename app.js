
const express = require('express');
const bodyParser = require('body-parser'); 
const path = require('path');

// Importa os roteadores
const userRoutes = require('./src/routes/user');
const productRoutes = require('./src/routes/product');

const app = express(); // Cria a instância do aplicativo Express

// Configurações do Express
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'src', 'views')); 

// Middlewares
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(express.static(path.join(__dirname, 'src', 'public')));

// Rotas da aplicação
app.get('/', (req, res) => {
    res.send(`
        <h1>Bem-vindo!</h1>
        <p><a href="/users/register">Cadastrar Usuário</a></p>
        <p><a href="/products/register">Cadastrar Produto</a></p>
    `);
});


app.use('/users', userRoutes);
app.use('/products', productRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

module.exports = app; // Exporta a instância do aplicativo Express