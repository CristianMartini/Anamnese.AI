# AGENTE.md

## Descrição Geral

Este aplicativo é uma solução interna para gestão de anamnese de pacientes, desenvolvido com foco em segurança, privacidade e facilidade de uso para clínicas ou profissionais de saúde. O sistema não é público e foi projetado para uso restrito, com controle total de acesso e administração.

---

## Funcionalidades Atuais

### 1. **Autenticação e Usuários**

- Login seguro via Firebase Authentication (email e senha).
- Cadastro de usuários apenas pelo administrador (sem cadastro público).
- Proteção de todas as rotas: apenas usuários autenticados acessam o app.
- Papel de usuário salvo na coleção `users` do Firestore (`role: 'admin'` ou `'user'`).
- Apenas o admin pode acessar o painel de administração.
- Recuperação de senha via email (opcional, se email real for usado).

### 2. **Administração**

- Painel de administração acessível apenas para o admin.
- Cadastro de novos usuários internos (email e senha, pode ser email fictício).
- Listagem de todos os usuários cadastrados.
- Redefinição de senha de qualquer usuário (envio de email de recuperação).
- Remoção de usuários.
- Feedback visual claro para todas as ações administrativas.

### 3. **Gestão de Pacientes**

- Cadastro completo de pacientes, incluindo dados pessoais, respostas a perguntas de saúde, hábitos, etc.
- Histórico de sessões (array de sessões por paciente, com data, relatório, medidas, etc).
- Edição e visualização detalhada dos dados do paciente.
- Todos os dados são salvos no Firestore, na coleção `patients`.

### 4. **Proteção e Segurança**

- Todas as rotas protegidas por autenticação.
- Painel de administração protegido por verificação de papel (apenas admin).
- Regras do Firestore recomendadas: apenas usuários autenticados podem ler/escrever dados.
- Sem cadastro público, sem exposição de dados sensíveis.
- Uso de HTTPS garantido pelo deploy (ex: Vercel).

### 5. **Experiência do Usuário (UI/UX)**

- Interface moderna, responsiva e amigável.
- Feedbacks claros de sucesso, erro e loading em todas as ações.
- Confirmações para ações sensíveis (ex: remoção de usuário).
- Navegação simples e intuitiva.

---

## O que o app deve fazer (requisitos futuros e boas práticas)

- Permitir troca de senha pelo próprio usuário logado.
- Permitir que o admin redefina a senha de qualquer usuário sem depender de email (opcional).
- Melhorar ainda mais a experiência visual (ícones, animações, dark mode, etc).
- Implementar logs de acesso e ações administrativas (opcional, para auditoria).
- Permitir exportação de dados de pacientes (CSV/PDF) para backup ou impressão.
- Garantir backup regular do Firestore.
-

---

## Observações de Segurança

- Nunca exponha dados sensíveis em rotas públicas.
- Sempre use HTTPS.
- Mantenha as regras do Firestore restritas a usuários autenticados.
- Faça backup regular dos dados.
- O controle de acesso deve ser revisado periodicamente.

---

## Fluxo Resumido

1. **Primeiro acesso:** admin cadastrado manualmente no Firebase Auth.
2. **Login:** apenas usuários cadastrados podem acessar.
3. **Administração:** admin pode cadastrar/remover usuários e redefinir senhas.
4. **Gestão de pacientes:** qualquer usuário autenticado pode cadastrar, editar e visualizar pacientes.

---

**Este app é para uso interno e não deve ser disponibilizado ao público geral.**
