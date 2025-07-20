# 📦 Projeto Final - Sistema de Cadastro de Usuários e Produtos

Este é um projeto de aplicação web desenvolvido com **Node.js**, **Express**, **Sequelize** e **PostgreSQL**, com o objetivo de demonstrar a criação de **APIs RESTful** para o gerenciamento de usuários e produtos. O projeto também inclui **testes de integração Jest** e **testes End-to-End (Cypress)**.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes, incluído com o Node.js)
- [PostgreSQL](https://www.postgresql.org/) (banco de dados relacional)

---

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/hyago1/gqs-projetofinal
```

---

### 2. Instale as dependências

```bash
npm install
```

---

### 3. Configure o banco de dados PostgreSQL

- Crie um banco de dados para uso principal (exemplo: `teste`)
- Atualize o arquivo `src/database/index.js` com suas credenciais:

```js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('seu_banco', 'seu_usuario', 'sua_senha', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
```

> ⚠️ Veirifique se o bancos está criado antes de rodar os testes ou a aplicação.

---

## 🚀 Executando o Projeto

### Iniciar o servidor

```bash
npm start
```

A aplicação será executada, por padrão, em `http://localhost:3000`.

---

## 🧪 Executando os Testes

O projeto possui dois tipos de testes: **Integração** e **End-to-End**.

---

### 🔹 Testes de Integração (Jest + Supertest)

Esses testes verificam o funcionamento dos endpoints da API e sua comunicação com o banco de dados.

#### Rodar os testes de integração:

```bash
npm test
```

Esse comando:

- Conecta ao banco `gqs_projetofinal_test_db`
- Sincroniza os modelos (recria tabelas e limpa dados)
- Executa os testes contidos em `__tests__/`

---

### 🔸 Testes End-to-End (Cypress)

Os testes E2E simulam o comportamento real de um usuário no navegador, testando o fluxo completo da aplicação.

#### 1. Inicie o servidor da aplicação

```bash
npm start
```

#### 2. Abra a interface gráfica do Cypress

```bash
npm run cypress:open
```

- Ao rodar o comando pela primeira vez, o Cypress exibirá um assistente de configuração.
- Escolha o modo "E2E Testing" e o navegador desejado.
- Após a configuração, selecione o arquivo de teste desejado em `cypress/e2e/` para executá-lo.

#### 3. Executar testes em modo headless (sem abrir o navegador)

```bash
npm run cypress:run
```


---


## 📁 Estrutura do Projeto

```bash
├── src/
│   ├── controllers/        # Lógica dos endpoints da API
│   ├── models/             # Definição dos modelos Sequelize
│   ├── routes/             # Arquivos de rotas da aplicação
│   └── database/
│       └── index.js        # Configuração da conexão com PostgreSQL
├── __tests__/              # Testes de integração com Jest e Supertest
├── cypress/
│   └── e2e/                # Testes E2E com Cypress
├── package.json            # Dependências e scripts npm
└── README.md
```

---

## 📜 Scripts disponíveis

- `npm start` — Inicia o servidor da aplicação
- `npm test` — Executa os testes de integração com Jest
- `npm run cypress:open` — Abre o Cypress com interface gráfica
- `npm run cypress:run` — Executa os testes E2E em modo headless

---

## 💡 Considerações Finais

Este projeto é uma base sólida para aprendizado de:

- Criação de APIs RESTful com Express
- Integração com banco de dados relacional (PostgreSQL)
- Testes automatizados de back-end e front-end


