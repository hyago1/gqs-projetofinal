
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');


router.get('/register', ProductController.showRegisterForm);

// Rota para CRIAR um novo produto (POST para API)

router.post('/', ProductController.registerProduct);

// Rota para LISTAR TODOS os produtos (GET para API)

router.get('/', ProductController.getAllProducts);

// Rota para BUSCAR um produto por ID (GET para API)

router.get('/:id', ProductController.getById);

// Rota para ATUALIZAR um produto por ID (PUT para API)

router.put('/:id', ProductController.updateProduct);

// Rota para DELETAR um produto por ID (DELETE para API)

router.delete('/:id', ProductController.deleteProduct);


module.exports = router;
