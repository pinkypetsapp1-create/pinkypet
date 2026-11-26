# Cómo retomar Pinky Pet

Última sesión: **26-11-2026**. Todo está guardado en GitHub (`main`, último commit `664d931` o posterior).

## Para empezar la próxima sesión

Abrid Claude Code en `~/proyecto/pinkypet` y escribid:

> Lee `docs/CONTINUAR.md` y retomamos donde lo dejamos.

Claude también tiene el estado guardado en su memoria del proyecto.

---

## Dónde estamos

| Fase | Contenido | Estado |
|---|---|---|
| F0 | Diseño conectado y sincronización | ✅ Hecha |
| F1 | Backend (NestJS + MongoDB) | ✅ Hecha |
| F2 | App con todas las pantallas | ✅ Hecha |
| F3 | Despliegue (Render + Atlas + APK) | ✅ Hecha: probada en el OPPO Reno 13 el 26-11 (APK, Google y texto al 200 %) |
| F4 | Informe Ionic vs nativo en un Android real | ⬜ Sin empezar |
| iOS | Ver la app en el simulador de Xcode | 🟡 Proyecto creado; **falta instalar Xcode** |

### Qué funciona en la nube

| Qué | Dirección |
|---|---|
| Web de la app | <https://pinky-pet-app.onrender.com> |
| Servidor (API) | <https://pinky-pet-api.onrender.com> · salud en `/health` · documentación en `/docs` |
| Base de datos | MongoDB Atlas, `Cluster0`, base `pinkypet` (7 mascotas) |
| Correo de recuperación | Brevo (remitente `pinky.pets.app1@gmail.com`) |
| Google (web y Android) | Google Cloud, proyecto «Pinky Pet», clientes «Pinky Pet web» y «Pinky Pet Android» |

### Hecho en la sesión del 25-11
- «¿Has olvidado tu contraseña?» con correo (Brevo) y «Repetir contraseña» en Registro.
- Tarjetas de mascota en 1 columna en móviles de menos de 412 px (OPPO Reno 13).
- La animación del logotipo sale cada vez que se abre la app.
- Ventanas de «Qué tiene en cuenta el test» en Inicio.
- Comando `/nueva-mascota` y primera mascota nueva: **Donatello**.
- **APK de Android** generado desde la terminal (sin Android Studio), con «Continuar con Google» y las barras del sistema corregidas.
- **Proyecto iOS** (`app/ios/`).

---

## Lo siguiente, por orden

### 1. Después de actualizar el Mac: comprobar que todo sigue en su sitio

Claude lo puede comprobar solo:
- Java 25: `/usr/libexec/java_home -v 25`
- SDK de Android: `~/Library/Android/sdk`
- Conexión con Atlas: `backend/.env`. Está solo en este Mac y no se sube a GitHub.

### 2. iOS en el simulador (lo hacéis vosotras/os)

**Se hará en el MacBook de una compañera:** guía completa en `docs/IOS.md`. Los pasos de abajo son para este Mac.
1. Instalar **Xcode** desde la App Store (≈ 15 GB, con vuestro Apple ID).
2. Abrir Xcode una vez y marcar **iOS** en las plataformas que ofrece instalar.
3. En la app Terminal (piden la contraseña de administración del Mac):
   ```
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```
4. Decid a Claude: **«Xcode está instalado, arranca la app en el simulador»**.

Después, si queréis, se crea el cliente de Google para iOS (docs/DEPLOY.md §4 bis).

### 3. ~~Cerrar la Fase 3 en el OPPO Reno 13~~ ✅ hecho el 26-11

### 4. Fase 4: informe Ionic vs nativo
Con el móvil real, valorar:
- la fidelidad visual;
- las zonas táctiles de 48 dp;
- el tema oscuro;
- el texto al 200 %;
- la animación inicial;
- la fluidez.

### Opcional
- **cron-job.org**: un aviso cada 10 minutos a `https://pinky-pet-api.onrender.com/health` para que el servidor no se duerma.
- **Seguridad:** cambiar la contraseña de Atlas y el token de GitHub, porque se escribieron en el chat. Si se cambia la de Atlas, hay que actualizarla en Render (`MONGODB_URI`) y en `backend/.env`.

---

## Para trabajar en local

En dos terminales:
```
cd ~/proyecto/pinkypet/backend && npm run dev:mem      # servidor con base de datos en memoria
cd ~/proyecto/pinkypet/app && npx ng serve --port 8100  # app en http://localhost:8100
```

## Comandos que más vais a usar

| Para | Qué escribir |
|---|---|
| Añadir una mascota | Rellenar `mascotas/nueva-mascota.md`, dejar la foto en `mascotas/fotos/` y escribir `/nueva-mascota` |
| Traer cambios de Claude Design | `/sincronizar-diseno` |
| Generar el APK | docs/DEPLOY.md §4 |
| Ver la app en el simulador de iPhone | docs/DEPLOY.md §4 bis |

## Documentos de referencia
- `CLAUDE.md`: reglas de oro y comandos.
- `docs/SPEC.md`: qué hace la app.
- `docs/DEPLOY.md`: nube, APK e iOS.
- `docs/design-feedback.md`: decisiones sobre el diseño.
- `docs/observaciones-2026-11-25.md`: observaciones del equipo (todas cerradas).
