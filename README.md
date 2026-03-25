# App de Notas - Checkpoint 4

## Descrição do Projeto

Este projeto é uma aplicação mobile de gerenciamento de notas pessoais desenvolvida como parte do Checkpoint 4 da disciplina de Mobile Application Development. O sistema permite que usuários criem contas e realizem login para gerenciar suas próprias anotações de forma segura e individualizada. As notas são armazenadas em tempo real, permitindo operações de criação, leitura, edição e exclusão (CRUD).

## Tecnologias Utilizadas

- React Native
- Expo Router
- Firebase Authentication (Gerenciamento de usuários)
- Firestore Database (Armazenamento de dados NoSQL)
- TypeScript (Tipagem estática)

## Funcionalidades

- Autenticação completa (Cadastro, Login e Logout).
- CRUD de notas vinculado ao UID do usuário logado.
- Filtro de busca por título em tempo real.
- Ordenação alfabética (A-Z e Z-A).
- Indicador de carregamento e confirmação de exclusão.

## Como rodar o projeto

1. Clone o repositório para sua máquina local.
2. Certifique-se de ter o Node.js e o Expo CLI instalados.
3. Instale as dependências do projeto:
    ```bash
    npm install
    ```
4. Inicie o servidor do Expo:
    ```bash
    npx expo start
    ```
5. Utilize um emulador Android/iOS ou o aplicativo Expo Go no dispositivo móvel para visualizar.

## Demonstração

O vídeo demonstrativo com o funcionamento da aplicação e a persistência de dados no console do Firebase Firestore pode ser acessado no link abaixo:

- Link do vídeo:

## Integrantes

- RM: 561061 | Arthur Thomas Mariano de Souza
- RM: 559873 | Davi Cavalcanti Jorge
- RM: 559728 | Mateus da Silveira Lima
