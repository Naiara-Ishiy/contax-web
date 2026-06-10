# Formatação e Anotações do Projeto

## Comandos executados

- `npm install --save-dev prettier`
  - instalou o Prettier como dependência de desenvolvimento.
- `npx prettier --write "src/**/*.{js,jsx,ts,tsx,css}" "*.json" "*.md"`
  - formatou automaticamente os arquivos de código e configuração suportados.

## Alterações feitas

### `package.json`

- adicionada a task `format`:
  - `npm run format`
  - mantém o padrão de formatação acessível para quem usar o projeto.

### `.prettierrc`

- criada configuração de formatação para manter o estilo do projeto.

### `.prettierignore`

- criada lista de exclusão para evitar formatar dependências e builds.

### `src/pages/telas/menuAdm/index.jsx`

- removido `useState(true)` em favor de `const isAdmin = true`.
- corrigido o estado inicial de `usuarioForm` para incluir `tipo_acesso` e `empresa_vinculada`.
- ajustado o reset do formulário de usuário para usar as mesmas chaves do estado.
- ajustado a exclusão de usuário para usar `usu_id` em vez de `id`.
- ajustado a exclusão de empresa para remover notas relacionadas por `empresa_id`.d /home/naiara/contax-web
npm install
- padronizado a chave do map de notas para usar `nota.doc_id || nota.id`.
- incluído `doc_id` e `doc_arquivo_nome` ao criar notas locais, evitando chaves indefinidas.

### `src/pages/telas/login/index.jsx`

- removido import não usado de `logo`.
- removido estado não utilizado `mostrarSenha`.
- simplificado o campo de senha para usar `type="password"`.

## Observações
d /home/naiara/contax-web
npm install
- A formatação automática já foi aplicada nos arquivos principais do projeto.
- O código foi limpo sem alterar a estilização visual existente.
- Agora há uma forma documentada e repetível de formatar o projeto com `npm run format`.
