# App de Notas - Checkpoint 5

## Descrição do Projeto

Este projeto é uma aplicação mobile de gerenciamento de notas pessoais desenvolvida como parte da disciplina de Mobile Application Development (Checkpoints 4 e 5). O sistema permite que usuários criem contas e realizem login para gerenciar suas próprias anotações de forma segura e individualizada. Além das operações de CRUD (criação, leitura, edição e exclusão) integradas ao Firebase, a aplicação agora conta com recursos avançados de geolocalização (Geocoding) e alertas aos usuários via Push Notifications (Notificações Locais).

## Tecnologias Utilizadas

### Checkpoint 04

- React Native
- Expo Router
- Firebase Authentication (Gerenciamento de usuários)
- Firestore Database (Armazenamento de dados NoSQL)
- TypeScript (Tipagem estática)

### Checkpoint 05

- **Expo Location** (Captura de GPS e Geocoding)
- **Expo Notifications** (Notificações Locais)
- **EAS Build** (Serviço de build em nuvem para geração de APK)

## Funcionalidades

### Checkpoint 04

- Autenticação completa (Cadastro, Login e Logout).
- CRUD de notas vinculado ao UID do usuário logado.
- Filtro de busca por título em tempo real.
- Ordenação alfabética (A-Z e Z-A).
- Indicador de carregamento e confirmação de exclusão.

### Checkpoint 05

- **Geocoding:** Exibição do nome da rua/cidade em que a nota foi criada, convertendo coordenadas geográficas.
- **Notificações Locais:** Alertas de boas-vindas ao logar e confirmação visual/sonora ao salvar uma nota.
- **Build Nativo:** Arquivo `.apk` gerado para instalação em dispositivos Android reais fora do ambiente de desenvolvimento.

## Instruções de como as novas funcionalidades foram implementadas (Checkpoint 5)

### 1. Notificações Locais (Expo Notifications)

As notificações foram implementadas de forma local, sem a necessidade de um servidor externo (FCM), utilizando a biblioteca `expo-notifications`.

- **Configuração:** O comportamento das notificações (exibição de banner e reprodução de som com o app aberto) foi definido globalmente no arquivo `_layout.tsx` através do `setNotificationHandler`.
- **Ações:** Criamos um serviço centralizado que solicita permissão ao usuário (`requestPermissionsAsync`) e agenda notificações imediatas (`scheduleNotificationAsync`). Elas são disparadas em dois momentos críticos: no sucesso do login (Boas-vindas) e no bloco `try/catch` de salvamento de uma nova nota.

### 2. Geocoding e GPS (Expo Location)

A funcionalidade de localização utiliza o pacote `expo-location` para capturar os dados do dispositivo no momento da criação da nota.

- **Captura:** Ao clicar em salvar uma nova nota, o app solicita a permissão de foreground (`requestForegroundPermissionsAsync`). Com a permissão concedida, extrai a latitude e longitude via `getCurrentPositionAsync()`.
- **Geocoding (Reverse):** Para exibir um endereço amigável na lista de notas, a função `reverseGeocodeAsync` é chamada durante o carregamento dos dados do Firestore, convertendo as coordenadas salvas em nomes de ruas, números e cidades, que são então injetados na interface visual do `ItemNota`.

### 3. Geração do Executável (.apk) via EAS Build

A compilação do aplicativo para instalação fora do ambiente de desenvolvimento (Expo Go) foi feita utilizando o Expo Application Services (EAS).

- **Configuração:** As permissões nativas de Android (GPS, Foreground Service e Notificações) foram devidamente mapeadas no `app.json`. Em seguida, criamos um arquivo `eas.json` com um perfil `preview` e `buildType: "apk"`.
- **Geração:** O processo foi executado na nuvem utilizando o comando `eas build --platform android --profile preview`. As dependências e o `package-lock.json` foram estritamente alinhados para passar na fase de pré-build, gerando com sucesso o executável que pode ser instalado em qualquer dispositivo Android via Sideloading.

## Como rodar o projeto no ambiente de desenvolvimento

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
5. Utilize o aplicativo Expo Go no dispositivo móvel para visualizar.

## Demonstração

O vídeo demonstrativo com o funcionamento da aplicação, persistência de dados, exibição de notificações, localização geocodificada e o build rodando no aparelho pode ser acessado no link abaixo:

- Link do vídeo: https://youtu.be/_KahqhK6D58

## Integrantes

- RM: 561061 | Arthur Thomas Mariano de Souza
- RM: 559873 | Davi Cavalcanti Jorge
- RM: 559728 | Mateus da Silveira Lima
