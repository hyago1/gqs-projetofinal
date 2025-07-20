// src/models/Product.js

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Nome do produto é obrigatório' },
                len: {
                    args: [2, 255],
                    msg: 'Nome do produto precisa ter pelo menos 2 caracteres'
                }
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                notNull: { msg: 'Preço é obrigatório' },
                isDecimal: { msg: 'Preço inválido' },
      
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 500],
                    msg: 'Descrição não pode exceder 500 caracteres'
                }
            }
        }
    }, {
        tableName: 'products'
    });

    return Product;
};
