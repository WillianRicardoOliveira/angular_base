# AGENTS.md

Instrucoes para agentes trabalhando neste repositorio.

## Escopo

- Aplicacao Angular `adminlte`.
- Codigo principal: `src/app`.
- Backend mock: `backend`, com `json-server` e `backend/db.json`.
- E2E legado: `e2e`, com Protractor.
- Dependencia local: `summernote`; abrir apenas se a tarefa envolver editor rich text, build ou empacotamento.

## Olhar primeiro

- Rotas: `src/app/app-routing.module.ts`
- Modulo raiz: `src/app/app.module.ts`
- Paginas: `src/app/pages`
- Modulos: `src/app/modules`
- Componentes compartilhados: `src/app/components`
- Servicos: `src/app/services`
- Guards: `src/app/guards`
- Interceptors: `src/app/interceptors`
- Store NgRx: `src/app/store`
- Interfaces: `src/app/interfaces`
- Configuracao Angular: `angular.json`
- Scripts/dependencias: `package.json`

## Evitar varrer

Nao analisar estes caminhos salvo pedido explicito:

- `node_modules/`
- `backend/node_modules/`
- `dist/`
- `.angular/`
- `coverage/`
- `out-tsc/`
- `.git/`
- `package-lock.json`, exceto em tarefas de dependencias
- `src/assets/**`, exceto tarefas visuais ou asset especifico
- `summernote/`, exceto tarefas ligadas a essa dependencia
