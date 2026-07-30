# Centro de Operaciones RAD-C28

Aplicación web para el registro de activistas, la organización territorial, la
formación y el seguimiento de la capacidad operativa de RAD-C28.

## Funcionalidades

- Inicio de sesión mediante cuentas individuales y sesiones revocables.
- Autorregistro público de activistas desde teléfono, tableta o computadora.
- Cambio obligatorio de la contraseña temporal en el primer acceso.
- Perfiles de acceso `admin`, `operator` y `activist`.
- Roles organizativos independientes de los permisos del sistema.
- Gestión de usuarios, activación, desactivación y restablecimiento de contraseña.
- Registro, edición, consulta y eliminación de activistas.
- Cédula, contacto, usuarios de redes y notas cifrados con AES-256-GCM.
- Directorio con filtros y exportación a CSV o JSON.
- Directorio territorial para activistas con nombres, municipio y redes del
  equipo, además del enlace al grupo de WhatsApp configurado para su territorio;
  los datos personales de contacto de los demás integrantes permanecen ocultos.
- Metas provinciales, seccionales del exterior y coordinación nacional.
- Dashboard y mapa alimentados exclusivamente por MySQL/MariaDB.
- Auditoría de accesos y operaciones críticas.
- Base inicial sin activistas ni valores de demostración.

## Requisitos

- Node.js 20 o superior.
- MySQL 8 o MariaDB compatible.
- Una base vacía y un usuario con permisos para crear y modificar tablas.

## Instalación local

1. Instale las dependencias:

   ```bash
   npm install
   ```

2. Copie `.env.example` como `.env` y complete las credenciales.

3. Genere una clave de cifrado:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Ejecute las migraciones:

   ```bash
   npm run migrate
   ```

5. Inicie la aplicación:

   ```bash
   npm start
   ```

6. Abra `http://127.0.0.1:4173`.

La primera ejecución crea el administrador definido por `ADMIN_USERNAME`,
`ADMIN_PASSWORD` y `ADMIN_NAME`. Esa cuenta deberá cambiar su contraseña al
iniciar sesión.

## Desarrollo

```bash
npm run dev
npm run check
npm test
```

No utilice la base de producción para desarrollo cotidiano. Las migraciones en
`db/migrations` permiten crear una base local con la misma estructura.

## Seguridad

- Nunca confirme `.env` en Git.
- Mantenga el repositorio privado.
- Use HTTPS en producción.
- Configure una clave `FIELD_ENCRYPTION_KEY` distinta por entorno y respáldela
  en un gestor seguro; perderla impide descifrar los campos protegidos.
- Autorice MySQL remoto únicamente desde IP conocidas.
- Revoque el acceso remoto de desarrollo al finalizar.
- No incluya datos personales en registros de prueba, capturas o incidencias.
- Revise periódicamente cuentas y fichas creadas mediante el autorregistro.

Consulte [DEPLOYMENT.md](./DEPLOYMENT.md) para el despliegue en Hostinger.
