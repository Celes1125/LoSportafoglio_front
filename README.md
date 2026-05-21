# LoSportafoglio - FRONTEND

Este es el repositorio del **Frontend** para la aplicación LoSportafoglio.

- **Backend:** Desplegado en Render.
- **Frontend Deployment:** [Vercel](https://vercel.com).
- **Gestor de Paquetes:** `pnpm` (Migrado desde npm).

## 🚀 Guía Rápida de pnpm

Este proyecto utiliza `pnpm` para una gestión de dependencias más rápida y eficiente.

### Instalación inicial
Si aún no tienes pnpm instalado globalmente:
```bash
npm install -g pnpm
```

### Comandos frecuentes
| Acción | Comando |
| :--- | :--- |
| Instalar dependencias | `pnpm install` |
| Levantar servidor local | `pnpm start` |
| Compilar para producción | `pnpm build` |
| Ejecutar tests | `pnpm test` |
| Auditar seguridad | `pnpm audit` |
| Actualizar overrides | `pnpm install` (aplica cambios en package.json) |

---

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 19.0.2.

## Development server

Para iniciar el servidor de desarrollo local, ejecuta:

```bash
pnpm start
```

Una vez que el servidor esté corriendo, abre tu navegador en `http://localhost:4200/`.

## Building

Para compilar el proyecto ejecuta:

```bash
pnpm build
```

Los artefactos se guardarán en el directorio `dist/`.

## Running unit tests

Para ejecutar pruebas unitarias con [Karma](https://karma-runner.github.io):

```bash
pnpm test
```

## Additional Resources

Para más información sobre Angular CLI, visita [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
