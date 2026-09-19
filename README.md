# AlertaPagosWeb

Aplicación Angular standalone. Desarrollo actual: maquetación frontend exclusivamente, sin backend. Toda la información se obtiene desde mocks locales.

## Requisitos

- Node.js `^20.19.0 || ^22.12.0 || >=24.0.0` (ver [.nvmrc](.nvmrc))
- npm `>= 10.0.0`

Si usas [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
```

## Instalación

```bash
npm install
```

El proyecto usa npm como único gestor de paquetes (ver `package-lock.json`). La configuración en `.npmrc` habilita `legacy-peer-deps` para evitar un fallo conocido de npm al resolver el árbol de dependencias opcionales de Vitest 4.

## Comandos

| Comando               | Descripción                                      |
| ---------------------- | ------------------------------------------------- |
| `npm start`            | Levanta el servidor de desarrollo (`ng serve`).   |
| `npm run build`        | Genera el build de producción en `dist/`.         |
| `npm test`             | Ejecuta los tests unitarios con Vitest.           |
| `npm run lint`         | Ejecuta ESLint sobre el proyecto.                 |
| `npm run format`       | Formatea el código con Prettier.                  |
| `npm run format:check` | Verifica el formato sin modificar archivos.       |

## Estructura

Este es el estado inicial del proyecto (fase de creación y configuración). La estructura por features, layout y componentes visuales se desarrollarán en fases posteriores.
