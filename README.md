# ETR-2026-Group--RDLC

## Variant 9 — Privacy & Data Retention (GDPR Persona)

### Equipa

| Papel                                       | Elemento        |
| ------------------------------------------- | --------------- |
| Facilitator (gestão do tempo e coordenação) | Luís Almoster   |
| Scribe (documentação)                       | Cristiano Sandu |
| Reviewer (controlo de qualidade)            | Deyve Silva     |
| Tester (execução e validação de testes)     | Rodrigo Ramos   |

---

# Problema

Durante a fase de **Intake & Discovery** de uma transição de serviços é necessário recolher, validar e gerir informação proveniente de diferentes stakeholders.

Este processo deve garantir:

* Minimização de dados pessoais;
* Conformidade com princípios GDPR;
* Validação da informação recolhida;
* Gestão de evidências documentais;
* Auditoria das operações realizadas;
* Controlo de retenção e eliminação de dados.

Processos manuais tornam difícil assegurar consistência, rastreabilidade e conformidade legal.

---

# Solução Desenvolvida

Foi desenvolvida uma aplicação de apoio ao processo de Intake & Discovery que permite:

* Registo e gestão de stakeholders;
* Aprovação de stakeholders autorizados;
* Gestão de evidências documentais;
* Validação automática de regras de negócio;
* Avaliação de prontidão da transição;
* Auditoria de operações;
* Gestão de retenção de dados;
* Aplicação de princípios GDPR.

A solução foi inicialmente gerada com apoio da plataforma Lovable e posteriormente integrada, adaptada e validada pela equipa.

---

# Demonstração da Aplicação

Aplicação disponível em:

https://secure-stakeholder-intake.lovable.app

Funcionalidades implementadas:

* Stakeholder Management
* Evidence Management
* Intake Evaluation
* Audit Logging
* Retention Management
* GDPR Validation
* Role-Based Access Control (RBAC)

---

# Documentação

O projeto segue o workflow estudado na unidade curricular:

1. Visão
2. Requisitos
3. Use Cases
4. User Stories
5. Critérios de Aceitação
6. Casos de Teste
7. Implementação
8. Testes

Toda a documentação encontra-se na pasta:

```text
docs/
```

---

# Estrutura do Projeto

```text
ETR-2026-Group--RDLC
│
├── docs/
│   ├── unit_test_report.md
│   ├── use_case_diagram.md
│   ├── use_case_diagram_v2.md
│   ├── use_cases.md
│   ├── use_cases_v2.md
│   ├── variant_assignment.md
│   ├── vibe_coding_log.md
│   └── vision.md
│
├── lovable-app/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── ams-store.ts
│   │   │   └── __tests__/
│   │   │       └── ams-store.test.ts
│   │   │
│   │   └── test/
│   │       └── setup.ts
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vitest.config.ts
│   └── .gitignore
│
├── src/
├── templates/
├── tests/
├── bdd/
├── README.md
└── .gitignore
```

---

# Tecnologias Utilizadas

## Aplicação

* React
* TypeScript
* Vite

## Testes

* Vitest
* JSDOM

## Gestão e Documentação

* GitHub
* Trello

## Ferramentas de Apoio

* Lovable
* ChatGPT
* GenAI

---

# Configuração do Ambiente

## Requisitos

* Node.js 20 ou superior
* npm

Verificar versões:

```bash
node -v
npm -v
```

---

# Instalação

Entrar na pasta da aplicação:

```bash
cd lovable-app
```

Instalar dependências:

```bash
npm install
```

---

# Executar os Testes

Executar todos os testes unitários:

```bash
npm test
```

ou

```bash
npx vitest run
```

---

# Executar Testes com Cobertura

```bash
npx vitest run --coverage
```

O relatório será gerado na pasta:

```text
lovable-app/coverage
```

Para visualizar o relatório:

```text
lovable-app/coverage/index.html
```

Abrir o ficheiro no browser.

---

# Evidências de Teste

Resultados obtidos:

* 23 testes executados
* 23 testes aprovados
* 0 falhas

Cobertura obtida:

| Métrica    | Resultado |
| ---------- | --------- |
| Statements | 89.87%    |
| Branches   | 81.44%    |
| Functions  | 91.83%    |
| Lines      | 92.57%    |

Os testes validam:

* GDPR Data Validation
* Stakeholder Management
* Role-Based Access Control
* Evidence Management
* Intake Evaluation
* Retention Management
* Audit Logging

---

# Gestão do Projeto

Trello:

https://trello.com/b/ctNdGLwu/meu-quadro-do-trello

---

# Repositório

Este repositório contém:

* Documentação de requisitos;
* Casos de utilização;
* Casos de teste;
* Aplicação funcional;
* Testes automatizados;
* Evidências de execução dos testes;
* Registo de utilização de ferramentas GenAI.

---

# Unidade Curricular

Engenharia de Requisitos e Testes

Ano Letivo 2025/2026
