# Despliegue en Hostinger

## 1. Preparar MySQL

Use la base `RADC28` creada en hPanel. Hostinger puede anteponer el identificador
de la cuenta al nombre y al usuario; copie los valores completos mostrados en el
panel.

La aplicación ejecuta automáticamente las migraciones al iniciar. La cuenta de
MySQL necesita permisos para crear y modificar tablas durante el primer
despliegue.

## 2. Configurar el repositorio

El repositorio debe ser privado y no debe contener `.env`. Hostinger puede
conectarse directamente al repositorio de GitHub y desplegar `main`.

Configuración de la aplicación:

- Entorno: Node.js 22.
- Tipo: Express u Other.
- Archivo de entrada: `server.js`.
- Comando de instalación: `npm install`.
- Comando de inicio: `npm start`.
- Directorio público: la aplicación lo administra desde `public/`.

## 3. Variables de entorno

Configure en hPanel:

```text
NODE_ENV=production
HOST=0.0.0.0
PORT=<puerto proporcionado por Hostinger>
DB_HOST=localhost
DB_PORT=3306
DB_NAME=<nombre completo de RADC28>
DB_USER=<usuario completo>
DB_PASSWORD=<contraseña de MySQL>
DB_CONNECTION_LIMIT=10
DB_SSL=false
FIELD_ENCRYPTION_KEY=<64 caracteres hexadecimales>
ADMIN_USERNAME=<usuario inicial>
ADMIN_PASSWORD=<contraseña temporal robusta>
ADMIN_NAME=<nombre del administrador>
SESSION_HOURS=8
TRUST_PROXY=1
```

No cambie `FIELD_ENCRYPTION_KEY` después de comenzar a registrar información.

## 4. Primera publicación

1. Despliegue la aplicación.
2. Compruebe `/api/health`.
3. Inicie sesión con el administrador inicial.
4. Cambie inmediatamente la contraseña temporal.
5. Cree las cuentas individuales necesarias.
6. Confirme que el directorio tiene cero activistas.
7. Registre un caso controlado, compruebe dashboard, edición y exportación.
8. Elimine el caso controlado antes de iniciar la alimentación oficial.

## 5. Actualizaciones

Cada archivo SQL nuevo debe añadirse a `db/migrations` con un prefijo secuencial.
La aplicación registra las migraciones aplicadas en `schema_migrations` y solo
ejecuta las pendientes.

Antes de cada publicación:

```bash
npm ci
npm run check
npm test
npm audit
```

Realice una copia de seguridad de MySQL antes de migraciones que transformen o
eliminen columnas.
