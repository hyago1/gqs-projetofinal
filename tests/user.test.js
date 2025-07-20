
const request = require('supertest');
const app = require('../app');
const { sequelize, connectDB } = require('../src/database');

beforeAll(async () => {
    await connectDB();
});

beforeEach(async () => {
    await sequelize.sync({ force: true }); // Limpa e recria as tabelas para cada teste
});

afterAll(async () => {
    await sequelize.close();
});

describe('User API', () => {
    // Teste POST /users - Criação de Usuário
    it('should create a new user', async () => {
        const newUser = {
            name: 'Test User',
            email: `testuser${Date.now()}@example.com`,
            password: 'password123'
        };
        const res = await request(app)
            .post('/users')
            .send(newUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Usuário cadastrado com sucesso!');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.name).toEqual(newUser.name);
        expect(res.body.user.email).toEqual(newUser.email);
    });

    
    it('should return 400 if user name is missing', async () => {
        const invalidUser = {
            email: `invaliduser${Date.now()}@example.com`,
            password: 'password123'
        };
        const res = await request(app)
            .post('/users')
            .send(invalidUser);

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Nome é obrigatório');
    });

    // Teste POST /users - Email duplicado
    it('should return 409 if email already exists', async () => {
        const existingEmailUser = {
            name: 'Existing User',
            email: `testuser${Date.now()}@example.com`, // Usará um email único para o primeiro cadastro
            password: 'password123'
        };

        // Primeiro, cria um usuário com o email
        await request(app)
            .post('/users')
            .send(existingEmailUser);

        // Tenta criar outro usuário com o mesmo email
        const res = await request(app)
            .post('/users')
            .send(existingEmailUser); // Tenta usar o mesmo email

        expect(res.statusCode).toEqual(409); // Status de Conflito
    
        expect(res.body.errors[0]).toContain(`Chave (email)=(${existingEmailUser.email}) já existe.`);
    });

    // Teste GET /users - Listar todos os usuários
    it('should return all users', async () => {
        // Crie um usuário para garantir que a lista não esteja vazia
        const userToCreate = { name: 'User for List', email: `listuser${Date.now()}@example.com`, password: 'password123' };
        await request(app).post('/users').send(userToCreate);

        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('name');
    });

    // Teste GET /users/:id - Buscar usuário por ID
    it('should return a user by ID', async () => {
        // Cria um usuário para este teste específico
        const userToGet = { name: 'User to Get', email: `getuser${Date.now()}@example.com`, password: 'password123' };
        const createRes = await request(app).post('/users').send(userToGet);
        const userId = createRes.body.user.id; // Obtém o ID localmente

        const res = await request(app).get(`/users/${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', userToGet.name);
        expect(res.body).toHaveProperty('id', userId);
    });

    // Teste GET /users/:id - ID inexistente
    it('should return 404 if user ID does not exist', async () => {
        const nonExistentId = 99999999; // Um ID que certamente não existe
        const res = await request(app).get(`/users/${nonExistentId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Usuário não encontrado.');
    });

    // Teste PUT /users/:id - Atualizar usuário
    it('should update a user by ID', async () => {
        // Cria um usuário para este teste específico
        const userToUpdate = { name: 'Original User', email: `originaluser${Date.now()}@example.com`, password: 'password123' };
        const createRes = await request(app).post('/users').send(userToUpdate);
        const userId = createRes.body.user.id;

        const updatedData = {
            name: 'Updated User Name',
            email: `updateduser${Date.now()}@example.com`,
            password: 'newpassword123'
        };
        const res = await request(app)
            .put(`/users/${userId}`)
            .send(updatedData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Usuário atualizado com sucesso!');
        expect(res.body.user.name).toEqual(updatedData.name);
        expect(res.body.user.email).toEqual(updatedData.email);
    });

    // Teste PUT /users/:id - Dados inválidos (ex: email inválido)
    it('should return 400 if updating with invalid data (invalid email)', async () => {
        // Cria um usuário para este teste específico
        const userToUpdateInvalid = { name: 'User for Invalid Update', email: `invalidupdateuser${Date.now()}@example.com`, password: 'password123' };
        const createRes = await request(app).post('/users').send(userToUpdateInvalid);
        const userId = createRes.body.user.id;

        const invalidUpdateData = {
            name: 'Invalid Email User',
            email: 'invalid-email', // Email inválido
            password: 'password123'
        };
        const res = await request(app)
            .put(`/users/${userId}`)
            .send(invalidUpdateData);

        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toContain('Por favor, insira um email válido');
    });

    // Teste PUT /users/:id - ID inexistente
    it('should return 404 if trying to update a non-existent user', async () => {
        const nonExistentId = 99999999;
        const res = await request(app)
            .put(`/users/${nonExistentId}`)
            .send({ name: 'Non Existent', email: 'nonexistent@example.com', password: 'pass' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Usuário não encontrado para atualização.');
    });

    // Teste DELETE /users/:id - Remover usuário
    it('should delete a user by ID', async () => {
        // Cria um usuário para este teste específico
        const userToDelete = { name: 'User to Delete', email: `deleteuser${Date.now()}@example.com`, password: 'password123' };
        const createRes = await request(app).post('/users').send(userToDelete);
        const userId = createRes.body.user.id;

        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toEqual(204);
        // Verifica se o usuário realmente sumiu do DB
        const checkRes = await request(app).get(`/users/${userId}`);
        expect(checkRes.statusCode).toEqual(404);
    });

    // Teste DELETE /users/:id - ID inexistente
    it('should return 404 if trying to delete a non-existent user', async () => {
        const nonExistentIdForDelete = 99999999;
        const res = await request(app).delete(`/users/${nonExistentIdForDelete}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Usuário não encontrado.');
    });
});
