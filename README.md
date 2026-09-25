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

Organización por features, siguiendo `src/app/`:

```
core/            Configuración central (selector de escenarios mock) y servicios transversales (toasts).
layout/          Shell de la app: header, sidebar de navegación y layout principal.
shared/          Componentes, directivas y pipes reutilizados por varias features (íconos, diálogos de confirmación, etc.).
features/
  inicio/        Resumen de próximos pagos.
  facturas/      Listado de facturas, detalle de factura y alta de pago manual.
  reportes/      Reportes de pagos con gráfico de barras.
  configuracion/ Preferencias de cuenta (idioma, moneda, contraseña, eliminar cuenta).
  not-found/     Página 404.
```

Cada feature sigue el mismo patrón interno: `pages/` (contenedores enrutados), `components/` (presentacionales), `models/`, `data/` (mocks) y `services/` (acceso a los mocks, inyectables). No hay backend: todo el estado vive en memoria y se puede simular carga, vacío, error y contenido extenso desde `MockScenarioService`.

## Despliegue

La app se despliega en Cloudflare Pages a partir de `main`:

- **URL:** [alertapagosweb.pages.dev/inicio](https://alertapagosweb.pages.dev/inicio)

El build output apunta a `dist/AlertaPagosWeb/browser`, y `public/_redirects` mantiene el enrutamiento del lado del cliente (Angular Router) funcionando en refresh/enlaces directos.

## Diseño y proyectos relacionados

- **Figma (Web):** [Web Wireframes](https://www.figma.com/design/ESqjDHenGDl2rbhm0NMuMx/Web-Wireframes?node-id=0-1&t=HiUQVCdqhSWE1S08-1)
- **Figma (Mobile):** [Mobile Mockups](https://www.figma.com/design/L9O30w2wxPvr37SkTWUt82/Mobile-Mockups?t=UmUETk9VuqvOebT0-1)
- **Repositorio mobile:** [alerta-pagos-mobile](https://github.com/jcordobav/alerta-pagos-mobile)
