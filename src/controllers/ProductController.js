
const { ValidationError } = require('sequelize');
const { sequelize } = require('../database');
const ProductController = {
    showRegisterForm: (req, res) => {
        res.render('product-register', { errors: [], oldData: {} });
    },

    registerProduct: async (req, res) => {
        const { name, price, description } = req.body;

        if (price === undefined || price === null || isNaN(parseFloat(price))) {
            return res.status(400).json({ errors: ['O preço deve ser um número válido.'] });
        }
        const productData = { name, price: parseFloat(price), description };

        try {
    
            const Product = sequelize.models.Product;
            const newProduct = await Product.create(productData);
            res.status(201).json({
                message: 'Produto cadastrado com sucesso!',
                product: newProduct
            });

        } catch (error) {
            console.error("Erro ao registrar produto:", error);
            let errorMessages = [];
            let statusCode = 500;

            if (error instanceof ValidationError) {
                statusCode = 400;
                errorMessages = error.errors.map(err => err.message);
            } else if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409;
                errorMessages.push('Este produto já existe ou um campo único está duplicado.');
            } else {
                errorMessages.push('Ocorreu um erro interno ao salvar o produto. Tente novamente mais tarde.');
            }

            res.status(statusCode || 500).json({ errors: errorMessages });
        }
    },

    getAllProducts: async (req, res) => {
        try {

            const Product = sequelize.models.Product;
            const products = await Product.findAll();
            res.status(200).json(products);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            res.status(500).json({ errors: ['Erro ao buscar produtos.'] });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;

            const Product = sequelize.models.Product;
            const product = await Product.findByPk(id); // findByPk busca pela chave primária
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error("Erro ao buscar produto por ID:", error);
            res.status(500).json({ errors: ['Erro interno do servidor.'] });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, description } = req.body;

            // Validações de preço
            if (price !== undefined && price !== null) {
                const parsedPrice = parseFloat(price);
                if (isNaN(parsedPrice)) {
                    return res.status(400).json({ errors: ['O preço deve ser um número válido.'] });
                }
                if (parsedPrice < 0) {
                    return res.status(400).json({ errors: ['Preço não pode ser negativo'] });
                }

                req.body.price = parsedPrice;
            }

            const Product = sequelize.models.Product;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado para atualização.' });
            }

            await product.update(req.body);
            res.status(200).json({ message: 'Produto atualizado com sucesso!', product });

        } catch (error) {
            console.error("Erro completo ao atualizar produto:", error);

            let errorMessages = [];
            let statusCode = 500;

            if (error instanceof ValidationError) {
                statusCode = 400;
                error.errors.forEach(err => {
                    console.error("Detalhe do erro de validação Sequelize:", err.message, "Caminho:", err.path);
                    errorMessages.push(err.message);
                });
            } else if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409;
                errorMessages.push('Este produto já existe ou um campo único está duplicado.');
            } else {
                errorMessages.push('Ocorreu um erro interno ao salvar o produto. Tente novamente mais tarde.');
            }
            res.status(statusCode).json({ errors: errorMessages });
        }
    },

  deleteProduct: async (req, res) => {
        const productId = req.params.id; // Pega o ID da URL

        try {
            const Product = sequelize.models.Product; // Acessa o modelo Product
            const deletedRows = await Product.destroy({
                where: { id: productId }
            });

            if (deletedRows === 0) {
      
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }

           
            res.status(204).send();

        } catch (error) {
          
            console.error("Erro ao deletar produto:", error); 
            
            res.status(500).json({ message: 'Ocorreu um erro ao deletar o produto.' });
        }
    },
     showSuccessPage: (req, res) => {
        res.send('<h1>Produto cadastrado com sucesso!</h1><p><a href="/">Voltar ao início</a></p>');
    }
};

module.exports = ProductController;
