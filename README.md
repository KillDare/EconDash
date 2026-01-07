# 📱 EconDash

**EconDash** é um aplicativo mobile para controle financeiro pessoal, desenvolvido com **React Native + Expo**.  
O app permite registrar **receitas e despesas**, acompanhar **resumos diários e mensais** e visualizar informações financeiras de forma simples e intuitiva.

> 📌 Projeto focado exclusivamente em **mobile**, com armazenamento **local no dispositivo**.

---

## ✨ Funcionalidades

- ➕ Cadastro de **receitas** e **despesas**
- 📅 Seleção de data (hoje, ontem ou data personalizada)
- 🗂️ Categorias específicas para receitas e despesas
- 📊 **Dashboard** com:
  - Gastos e ganhos do dia
  - Gastos e ganhos do mês
  - Última transação registrada
- 💾 Armazenamento local utilizando **SQLite**
- 🌙 Suporte a **modo claro e escuro**
- 📱 Interface responsiva e otimizada para dispositivos móveis

---

## 🛠️ Tecnologias Utilizadas

- **React Native**
- **Expo (SDK 54)**
- **Expo Router**
- **SQLite (armazenamento local)**
- **TypeScript**
- **Context API (ThemeContext)**
- **React Navigation**

---

## 📂 Estrutura do Projeto (resumo)

app/
├─ (tabs)/
│ ├─ index.tsx # Home
│ ├─ cashflow.tsx # Adição de transações
│ └─ dashboard.tsx # Dashboard financeiro
├─ database/
│ └─ sqlite.ts # Banco de dados local
├─ hooks/
│ └─ useFinance.ts # Lógica central de finanças
└─ components/
└─ themed-* # Componentes com suporte a tema

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Node.js (LTS)
- Expo CLI
- Dispositivo físico com **Expo Go** ou emulador Android/iOS

### Passos

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npx expo start

Escaneie o QR Code com o Expo Go ou execute em um emulador.