const { Sequelize } = require('sequelize');

const UserModel = require('../models/User');
const ProductModel = require('../models/Product');


const sequelize = new Sequelize('', 'postgres', '2003', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com PostgreSQL estabelecida com sucesso!');

      
        UserModel(sequelize, Sequelize.DataTypes);
        ProductModel(sequelize, Sequelize.DataTypes);


        Object.keys(sequelize.models).forEach(modelName => {
            if (sequelize.models[modelName].associate) {
                sequelize.models[modelName].associate(sequelize.models);
            }
        });

        // Sincroniza os modelos com a base de dados.
        await sequelize.sync({ alter: true });
        console.log('Todos os modelos foram sincronizados com o banco de dados.');

    } catch (error) {
        console.error('Erro ao conectar ou sincronizar com PostgreSQL:', error);
        throw error;
    }
};

module.exports = { sequelize, connectDB };
