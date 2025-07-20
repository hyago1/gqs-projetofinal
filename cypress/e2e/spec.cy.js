
    describe('Página Inicial', () => {

        beforeEach(() => {
            cy.visit('http://localhost:3000'); 
        });
        it('deve carregar a página inicial e exibir o título de boas-vindas', () => {
  
            cy.get('h1').should('contain', 'Bem-vindo!');
        });
        // Teste: Deve ter links para cadastro de usuário e produto
        it('deve ter links para cadastro de usuário e produto', () => {
            // Verifica se existe um link com o texto "Cadastrar Usuário" e o href correto
            cy.get('a').contains('Cadastrar Usuário').should('have.attr', 'href', '/users/register');
            // Verifica se existe um link com o texto "Cadastrar Produto" e o href correto
            cy.get('a').contains('Cadastrar Produto').should('have.attr', 'href', '/products/register');
        });
    });
    