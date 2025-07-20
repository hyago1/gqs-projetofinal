// __tests__/product.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize, connectDB } = require('../src/database');

beforeAll(async () => {
    await connectDB();
});

// Use beforeEach para limpar o DB e criar um produto antes de CADA teste
beforeEach(async () => {
    await sequelize.sync({ force: true }); // Limpa e recria as tabelas para cada teste
});

afterAll(async () => {
    await sequelize.close();
});

describe('Product API', () => {
    // Não precisamos mais de 'let productId;' aqui, pois será criado e obtido em cada teste que precisar.

    // Teste POST /products - Criação de Produto
    it('should create a new product', async () => {
        const newProduct = {
            name: 'Test Product',
            price: 99.99,
            description: 'A product created for testing purposes.'
        };
        const res = await request(app)
            .post('/products')
            .send(newProduct);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Produto cadastrado com sucesso!');
        expect(res.body.product).toHaveProperty('id');
        expect(res.body.product.name).toEqual(newProduct.name);
        expect(parseFloat(res.body.product.price).toFixed(2)).toEqual(newProduct.price.toFixed(2));
        // productId não é mais uma variável global aqui, é local ao teste se necessário
    });

    // Teste POST /products - Dados inválidos (nome faltando)
    it('should return 400 if product name is missing', async () => {
        const invalidProduct = {
            price: 10.00,
            description: 'Invalid product'
        };
        const res = await request(app)
            .post('/products')
            .send(invalidProduct);

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Nome do produto é obrigatório');
    });

    // Teste GET /products - Listar todos os produtos
    it('should return all products', async () => {
        // Crie um produto para garantir que a lista não esteja vazia
        const productToCreate = { name: 'Product for List', price: 10.00, description: 'Desc' };
        await request(app).post('/products').send(productToCreate);

        const res = await request(app).get('/products');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('name', productToCreate.name);
    });

    // Teste GET /products/:id - Buscar produto por ID
    it('should return a product by ID', async () => {
        // Cria um produto para este teste específico
        const productToGet = { name: 'Product to Get', price: 20.00, description: 'Desc' };
        const createRes = await request(app).post('/products').send(productToGet);
        const productId = createRes.body.product.id; // Obtém o ID localmente

        const res = await request(app).get(`/products/${productId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', productToGet.name);
        expect(res.body).toHaveProperty('id', productId);
    });

    // Teste GET /products/:id - ID inexistente
    it('should return 404 if product ID does not exist', async () => {
        const nonExistentId = 99999999; // Um ID que certamente não existe
        const res = await request(app).get(`/products/${nonExistentId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Produto não encontrado.');
    });

    // Teste PUT /products/:id - Atualizar produto
    it('should update a product by ID', async () => {
        // Cria um produto para este teste específico
        const productToUpdate = { name: 'Original Product', price: 50.00, description: 'Original Desc' };
        const createRes = await request(app).post('/products').send(productToUpdate);
        const productId = createRes.body.product.id;

        const updatedData = {
            name: 'Updated Test Product',
            price: 120.50,
            description: 'Updated description for testing.'
        };
        const res = await request(app)
            .put(`/products/${productId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Produto atualizado com sucesso!');
        expect(res.body.product.name).toEqual(updatedData.name);
        expect(parseFloat(res.body.product.price).toFixed(2)).toEqual(updatedData.price.toFixed(2));
    });

    // Teste PUT /products/:id - Dados inválidos (ex: preço negativo)
    it('should return 400 if updating with invalid data (negative price)', async () => {
        // Cria um produto para este teste específico
        const productToUpdateInvalid = { name: 'Product for Invalid Update', price: 60.00, description: 'Desc' };
        const createRes = await request(app).post('/products').send(productToUpdateInvalid);
        const productId = createRes.body.product.id;

        const invalidUpdateData = {
            name: 'Updated Product',
            price: -5.00, // Preço inválido
            description: 'Attempt to update with invalid price.'
        };
        const res = await request(app)
            .put(`/products/${productId}`)
            .send(invalidUpdateData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Preço não pode ser negativo');
    });

    // Teste PUT /products/:id - ID inexistente
    it('should return 404 if trying to update a non-existent product', async () => {
        const nonExistentId = 99999999;
        const res = await request(app)
            .put(`/products/${nonExistentId}`)
            .send({ name: 'Non Existent', price: 10, description: 'Desc' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Produto não encontrado para atualização.');
    });

    // Teste DELETE /products/:id - Remover produto
    it('should delete a product by ID', async () => {
        // Cria um produto para este teste específico
        const productToDelete = { name: 'Product to Delete', price: 70.00, description: 'Desc' };
        const createRes = await request(app).post('/products').send(productToDelete);
        const productId = createRes.body.product.id;

        const res = await request(app).delete(`/products/${productId}`);
        expect(res.statusCode).toEqual(204);
        // Verifica se o produto realmente sumiu do DB
        const checkRes = await request(app).get(`/products/${productId}`);
        expect(checkRes.statusCode).toEqual(404);
    });

    // Teste DELETE /products/:id - ID inexistente
    it('should return 404 if trying to delete a non-existent product', async () => {
        const nonExistentIdForDelete = 99999999;
        const res = await request(app).delete(`/products/${nonExistentIdForDelete}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Produto não encontrado.');
    });
});
