// src/models/User.js

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Nome é obrigatório' },
                len: {
                    args: [3, 255],
                    msg: 'Nome precisa ter pelo menos 3 caracteres'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Este email já está cadastrado' },
            validate: {
                notNull: { msg: 'Email é obrigatório' },
                isEmail: { msg: 'Por favor, insira um email válido' }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Senha é obrigatória' },
                len: {
                    args: [6, 255],
                    msg: 'Senha precisa ter pelo menos 6 caracteres'
                }
            }
        }
    }, {
        tableName: 'users'
    });

    return User;
};
