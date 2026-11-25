# Despliegue (Fase 3)

Orden: **1 Atlas → 2 Render → 3 Google → 4 Android Studio y APK → 5 prueba**. Ningún secreto se pega en el chat ni en el repositorio: solo en los paneles de Atlas, Render y Google.

## 1. Base de datos: MongoDB Atlas (gratis)

1. Entra en <https://www.mongodb.com/cloud/atlas/register> y crea una cuenta.
2. **Create** → plan **M0 (Free)** → proveedor AWS, región **Frankfurt (eu-central-1)** (la misma que Render) → nombre `pinkypet`.
3. **Database Access** → *Add New Database User*:
   - Usuario: `pinkypet-api`.
   - Contraseña: pulsa **Autogenerate Secure Password** y cópiala a un sitio seguro (la necesitas en el paso 6).
   - Rol: *Read and write to any database*.
4. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
   *Por qué (decisión F3-2):* Render gratuito no tiene una IP fija. La protección es la contraseña larga del usuario.
5. **Database** → *Connect* → *Drivers* → copia la URI. Tiene esta forma:
   `mongodb+srv://pinkypet-api:<password>@pinkypet.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Sustituye `<password>` por la contraseña del paso 3 y añade el nombre de la base de datos detrás de `.net/`: `…mongodb.net/pinkypet?retryWrites=true&w=majority`. Esa es tu **`MONGODB_URI`**.

## 2. Backend: Render (gratis)

1. Entra en <https://render.com> con la cuenta de GitHub `pinkypetsapp1-create`.
2. **New** → **Blueprint** → elige el repositorio `pinkypet`. Render lee `render.yaml` y propone el servicio **pinky-pet-api**.
3. Te pedirá los valores marcados como secretos:
   | Variable | Qué poner |
   |---|---|
   | `MONGODB_URI` | La URI del paso 1.6 |
   | `SEED_DEMO_PASSWORD` | Una contraseña para las 3 cuentas demo (mín. 8 caracteres). Guárdala: es con la que entraréis en la demo |
   | `GOOGLE_CLIENT_IDS` | Déjalo vacío por ahora; se rellena en el paso 3 |
   `JWT_SECRET` y `JWT_REFRESH_SECRET` los genera Render solo (decisión F3-1).
4. **Apply**. La primera compilación tarda unos minutos. Al arrancar con la base de datos vacía, carga sola las 6 mascotas, las 15 preguntas y las cuentas demo (decisión F3-3).
5. Comprueba la URL: `https://pinky-pet-api.onrender.com/health` debe responder `{"status":"ok","db":"up"}`. **Si Render os da otra URL**, decídmelo: hay que cambiarla en `app/src/environments/environment.prod.ts`.

> El plan gratuito se duerme tras 15 minutos sin uso y tarda ~1 minuto en despertar. La app lo despierta al abrirse y espera hasta 75 s en cada petición.

## 2 bis. La app como web: Render (gratis)

`render.yaml` también publica la app como sitio estático **pinky-pet-app**: <https://pinky-pet-app.onrender.com>. Se vuelve a publicar sola con cada push a `main`. El backend acepta sus peticiones (está en `CORS_ORIGINS`).

## 3. «Continuar con Google»: Google Cloud (gratis)

Necesitas la **huella SHA-1** de la firma del APK de depuración, que aparece al instalar Android Studio (paso 4.3). Puedes hacer los puntos 1–4 ya y el 5 después.

1. <https://console.cloud.google.com> → crea el proyecto **Pinky Pet**.
2. **APIs y servicios → Pantalla de consentimiento de OAuth** → tipo **Externo** → nombre «Pinky Pet», tu correo de asistencia → ámbitos `email` y `profile` → en **Usuarios de prueba**, añade los correos de Google con los que vais a probar.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth → Aplicación web** → nombre «Pinky Pet web» → en *Orígenes de JavaScript autorizados* añade `https://pinky-pet-app.onrender.com` y `http://localhost:8100`, y en *URIs de redireccionamiento autorizados* `https://pinky-pet-app.onrender.com/` y `http://localhost:8100/` (con la barra final: en la web, Google vuelve a la raíz de la app en una ventana emergente). Copia el **ID de cliente** (termina en `.apps.googleusercontent.com`; no es secreto).
4. Pega ese ID:
   - en `app/src/environments/environment.ts` y `environment.prod.ts`, en `googleWebClientId`;
   - en Render, en la variable `GOOGLE_CLIENT_IDS`.
5. **Crear credenciales → ID de cliente de OAuth → Android** → paquete `es.pinkypet.app` → huella SHA-1 del paso 4.3. Copia también este ID y añádelo en Render a `GOOGLE_CLIENT_IDS`, separado por una coma del de la web.

## 3 bis. «¿Has olvidado tu contraseña?»: Brevo (gratis, 300 correos al día)

1. Crea una cuenta en <https://www.brevo.com> (plan Free).
2. **Senders, Domains & Dedicated IPs → Senders → Add a sender**: nombre «Pinky Pet» y el correo del equipo. Brevo envía un código a ese correo para verificarlo.
3. **SMTP & API → API Keys → Generate a new API key** (nombre «pinky-pet-api»). Cópiala: solo se ve una vez. **No la pegues en el chat.**
4. En Render → **pinky-pet-api → Environment**: `BREVO_API_KEY` = la clave y `MAIL_FROM` = el correo verificado del paso 2. `APP_URL` ya viene puesta (`https://pinky-pet-app.onrender.com`).
5. Prueba: en la app, *Iniciar sesión → ¿Has olvidado tu contraseña?* con una cuenta vuestra. El correo llega en menos de un minuto (mirad también en spam). El enlace caduca en 1 hora y solo sirve una vez; al cambiar la contraseña se cierran las sesiones abiertas.

Sin `BREVO_API_KEY` todo funciona igual, pero el correo no sale (en local se escribe en la terminal de la API).

## 4. App Android: Android Studio y APK de depuración

1. Instala **Android Studio** desde <https://developer.android.com/studio> (con el asistente por defecto: SDK, emulador y JDK incluidos).
2. En Android Studio → *Device Manager* → crea un emulador **Pixel 7** (pantalla de 412 × 915 dp, la más parecida al lienzo) con Android 15.
3. Huella SHA-1 para Google (paso 3.5), en la terminal:
   `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1`
4. Genera el APK (o pídemelo y lo hago yo):
   ```
   cd app
   npx ng build
   npx cap sync android
   cd android && ./gradlew assembleDebug
   ```
   El APK queda en `app/android/app/build/outputs/apk/debug/app-debug.apk`. Para abrirlo en el emulador: `npx cap run android`.

## 5. Prueba básica

- **Automática** (desde `backend/`): `npm run smoke -- https://pinky-pet-api.onrender.com`. Comprueba salud, registro, test, compatibilidad, solicitud, «una sola activa», estado, cancelación y que el simulador no existe en producción.
- **En el emulador o el móvil:** registrarse → hacer el test → ver compatibles → enviar una solicitud → ver su estado. Y «Continuar con Google» si ya está configurado.
- **Texto 200 %** (D3): en el emulador, *Ajustes → Accesibilidad → Tamaño de la fuente* al máximo, y revisar las pantallas.

## Reiniciar la demo

En el plan gratuito no hay consola en Render. Desde vuestro ordenador, con `MONGODB_URI` y `SEED_DEMO_PASSWORD` en `backend/.env`: `cd backend && npm run seed`. Restablece las mascotas y las 3 cuentas demo; no toca las demás cuentas.

## Añadir mascotas

Rellenad `mascotas/nueva-mascota.md`, dejad la foto en `mascotas/fotos/` y escribid `/nueva-mascota` en Claude Code. Para subirla a Atlas hace falta `backend/.env` con `MONGODB_URI` (una sola vez). No uséis `npm run seed` para esto: restablece las cuentas demo y vuelve a poner disponibles las mascotas adoptadas.
