
const { ValidationError } = require('sequelize');
const { sequelize } = require('../database'); // Importa a instância do sequelize

const UserController = {

    showRegisterForm: (req, res) => {
        res.render('user-register', { errors: [], oldData: {} });
    },


    createUser: async (req, res) => {
        const userData = req.body; // Dados vêm como JSON no corpo da requisição

        try {
         
            const User = sequelize.models.User;
           
            const newUser = await User.create(userData);

            // Resposta de sucesso (201 Created) com o usuário criado
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                user: newUser
            });

        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            let errorMessages = [];
            let statusCode = 500; // Default para erro interno


            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409; // Conflict para email duplicado
          
                if (error.errors && error.errors.length > 0) {
                    errorMessages = error.errors.map(err => err.message);
                } else if (error.parent && error.parent.detail) {
              
                    errorMessages.push(error.parent.detail);
                } else {
                    errorMessages.push('Este email já está cadastrado.');
                }
                console.log("UserController: createUser - Entrou no bloco UniqueConstraintError. Status Code definido:", statusCode);
            } else if (error instanceof ValidationError) { 
                statusCode = 400; // Bad Request para erros de validação
                errorMessages = error.errors.map(err => err.message);
                console.log("UserController: createUser - Entrou no bloco ValidationError. Status Code definido:", statusCode); // Log para depuração
            } else {
                errorMessages.push('Ocorreu um erro interno do servidor.');
            }

          
            console.log("UserController: createUser - Enviando status FINAL:", statusCode, "com erros:", errorMessages);

            // Resposta de erro com código e detalhes em JSON
            res.status(statusCode).json({
                errors: errorMessages
            });
        }
    },

    // Método para listar todos os usuários (GET para API, responde JSON)
    getAllUsers: async (req, res) => {
        try {
       
            const User = sequelize.models.User;
            const users = await User.findAll(); // Busca todos os usuários do banco de dados
            res.status(200).json(users);        // Retorna a lista de usuários como JSON com status 200
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            res.status(500).json({ errors: ['Erro ao buscar usuários.'] });
        }
    },

    
    getById: async (req, res) => {
        const userId = req.params.id; // Pega o ID da URL (ex: /users/123)

        try {

            const User = sequelize.models.User;
            const user = await User.findByPk(userId); // Busca o usuário pela chave primária (ID)

            if (!user) {
                // Se o usuário não for encontrado, retorna 404 Not Found
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Se o usuário for encontrado, retorna 200 OK com os dados do usuário
            res.status(200).json(user);

        } catch (error) {
            console.error("Erro ao buscar usuário por ID:", error);
            res.status(500).json({ errors: ['Ocorreu um erro interno ao buscar o usuário.'] });
        }
    },


    updateUser: async (req, res) => {
        const userId = req.params.id; // Pega o ID do usuário a ser atualizado
        const userData = req.body;    // Dados para atualização vêm do corpo da requisição

        try {
        
            const User = sequelize.models.User;
          
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
            }

       
            await user.update(userData);

            // Resposta de sucesso (200 OK) com o usuário atualizado
            res.status(200).json({
                message: 'Usuário atualizado com sucesso!',
                user: user // Retorna o objeto de usuário atualizado
            });

        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            let errorMessages = [];
            let statusCode = 500;

         
            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409; 

                if (error.errors && error.errors.length > 0) {
                    errorMessages = error.errors.map(err => err.message);
                } else if (error.parent && error.parent.detail) {
                    errorMessages.push(error.parent.detail);
                } else {
                    errorMessages.push('Este email já está cadastrado.'); // Fallback
                }
            } else if (error instanceof ValidationError) { 
                statusCode = 400; // Bad Request para erros de validação
                errorMessages = error.errors.map(err => err.message);
            } else {
                errorMessages.push('Ocorreu um erro interno ao atualizar o usuário. Tente novamente mais tarde.');
            }

            res.status(statusCode).json({
                errors: errorMessages
            });
        }
    },


    deleteUser: async (req, res) => {
        const userId = req.params.id; // Pega o ID da URL

        try {

            const User = sequelize.models.User;
            // Tenta deletar o usuário. destroy() retorna o número de linhas afetadas.
            const deletedRows = await User.destroy({
                where: { id: userId } // Condição para deletar
            });

            if (deletedRows === 0) {
                // Se 0 linhas foram afetadas, significa que o usuário não foi encontrado
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Se 1 linha foi afetada, o usuário foi deletado com sucesso
            // Retornamos 204 No Content, que é padrão para DELETE bem-sucedido sem corpo de resposta
            res.status(204).send();

        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            res.status(500).json({ message: 'Ocorreu um erro ao deletar o usuário.' });
        }
    }
};

module.exports = UserController;
