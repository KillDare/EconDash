

# 📊 EconDash

**EconDash** é um aplicativo multiplataforma para controle financeiro pessoal, desenvolvido com **React Native + Expo**, com suporte a **Web, Android e iOS**.

O app permite registrar **receitas e despesas**, acompanhar **resumos diários e mensais**, visualizar indicadores financeiros e realizar **backup/importação de dados via CSV**.

> Projeto com foco em experiência do usuário, persistência local e compatibilidade multiplataforma.

---

## ✨ Funcionalidades

- ➕ Cadastro de **receitas** e **despesas**
- 📅 Seleção de data (hoje, ontem ou data personalizada)
- 🗂️ Categorias personalizadas para transações
- 📊 **Dashboard financeiro** com:
  - Gastos e ganhos do dia
  - Gastos e ganhos do mês
  - Última transação registrada
- 💾 Armazenamento local:
  - SQLite (mobile)
  - Storage local (web)
- 📤 **Exportação de dados em CSV**
- 📥 **Importação de backups via CSV**
- 🌙 Suporte a **modo claro e escuro**
- 📱 Interface responsiva (mobile e desktop)
- 🌐 Compatível com **Web, Android e iOS**

---

## 🛠️ Tecnologias Utilizadas

- **React Native**
- **Expo (SDK 54)**
- **Expo Router**
- **TypeScript**
- **SQLite**
- **AsyncStorage / Web Storage**
- **Context API**
- **React Navigation**

---

## 📂 Estrutura do Projeto (resumo)

```txt
app/
├─ (tabs)/
│  ├─ index.tsx        # Home
│  ├─ cashflow.tsx     # Adição de transações
│  └─ dashboard.tsx    # Dashboard financeiro
├─ database/
│  └─ sqlite.ts        # Banco de dados local
├─ hooks/
│  └─ useFinance.ts    # Lógica central de finanças
├─ services/
│  └─ csv.ts           # Importação e exportação CSV
└─ components/
   └─ themed-*         # Componentes com suporte a tema
```

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

* Node.js (LTS)
* Expo CLI

### Passos

# Instalar dependências
npm install

# Iniciar o projeto
npx expo start (mobile)
npx expo web (web)


## 🌐 Versão Web

A versão web do projeto pode ser acessada em:

👉 [https://killdare.github.io/EconDash](https://killdare.github.io/EconDash)

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de:

* Consolidar conhecimentos em **React Native**
* Criar uma aplicação **real e utilizável**
* Explorar desenvolvimento **multiplataforma com Expo**
* Aplicar conceitos de **estado global, persistência e UX**
