
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


router.get('/register', UserController.showRegisterForm);

// Rota para CRIAR um novo usuário (POST para API)

router.post('/', UserController.createUser);

// Rota para LISTAR TODOS os usuários (GET para API)

router.get('/', UserController.getAllUsers);

// Rota para BUSCAR um usuário por ID (GET para API)

router.get('/:id', UserController.getById);

// Rota para ATUALIZAR um usuário por ID (PUT para API)

router.put('/:id', UserController.updateUser);

// Rota para DELETAR um usuário por ID (DELETE para API)

router.delete('/:id', UserController.deleteUser);

module.exports = router;
