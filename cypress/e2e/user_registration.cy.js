
describe('Cadastro de Usuário', () => {
    
    beforeEach(() => {
        cy.visit('http://localhost:3000/users/register'); 
    });

    // Teste: Deve carregar o formulário de cadastro de usuário
    it('deve carregar o formulário de cadastro de usuário', () => {
        // Verifica se o título do formulário está presente
        cy.get('h1').should('contain', 'Cadastrar Novo Usuário');
        // Verifica se os campos de input para nome, email e password estão presentes
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        // Verifica se o botão de submissão está presente
        cy.get('button[type="submit"]').should('contain', 'Cadastrar');
    });

    // Teste: Deve cadastrar um novo usuário com sucesso
    it('deve cadastrar um novo usuário com sucesso', () => {
        // Gera um email único para cada execução do teste
        const uniqueEmail = `testuser${Date.now()}@example.com`;

        // Preenche o formulário
        cy.get('input[name="name"]').type('Cypress User');
        cy.get('input[name="email"]').type(uniqueEmail);
        cy.get('input[name="password"]').type('password123');

  
        cy.get('button[type="submit"]').click();

        cy.contains('Usuário cadastrado com sucesso!').should('be.visible');

    
    });

    // Teste: Deve exibir erro ao tentar cadastrar usuário com email duplicado
    it('deve exibir erro ao tentar cadastrar usuário com email duplicado', () => {
        const duplicateEmail = `duplicate${Date.now()}@example.com`;

        // Primeiro cadastro (bem-sucedido)
        cy.get('input[name="name"]').type('First User');
        cy.get('input[name="email"]').type(duplicateEmail);
        cy.get('input[name="password"]').type('pass123');
        cy.get('button[type="submit"]').click();
        cy.contains('Usuário cadastrado com sucesso!').should('be.visible');

        // Volta para a página de cadastro para tentar cadastrar o mesmo email
        cy.visit('http://localhost:3000/users/register');

        // Segundo cadastro com o mesmo email (deve falhar)
        cy.get('input[name="name"]').type('Second User');
        cy.get('input[name="email"]').type(duplicateEmail);
        cy.get('input[name="password"]').type('pass123');
        cy.get('button[type="submit"]').click();

        // Verifica a mensagem de erro de email duplicado
      
        cy.contains(`Chave (email)=(${duplicateEmail}) já existe.`).should('be.visible');
    });

    // Teste: Deve exibir erro ao tentar cadastrar usuário com dados inválidos (ex: nome vazio)
    it('deve exibir erro ao tentar cadastrar usuário com nome vazio', () => {
        const email = `invalidname${Date.now()}@example.com`;

        // Preenche o formulário com nome vazio
        cy.get('input[name="name"]').type('{selectall}{backspace}'); // Garante que o campo está vazio
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="password"]').type('password123');

        
        cy.get('button[type="submit"]').click();

        cy.contains('Nome precisa ter pelo menos 3 caracteres').should('be.visible');
    });
});
