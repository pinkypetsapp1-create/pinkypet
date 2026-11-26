# Pinky Pet en el simulador de iPhone (Xcode)

Guía para abrir la app en el simulador de iPhone desde **cualquier Mac**. No hay que transformar ni adaptar nada: el proyecto iOS ya está creado y subido a GitHub (`app/ios/`). Solo hay que descargarlo, instalar las dependencias y abrirlo en Xcode.

> Si en ese Mac está Claude Code, basta con decirle: **«Lee docs/IOS.md y ayúdame a abrir la app en el simulador»**.

**Tiempo:** unos 20 minutos, sin contar la descarga de Xcode (puede tardar más de una hora).

---

## 1. Qué hace falta en el Mac

| Qué | Cómo comprobarlo | Si falta |
|---|---|---|
| macOS 15.6 o posterior | Menú  → Acerca de este Mac | Actualizar macOS |
| Unos 40 GB libres | Menú  → Ajustes → General → Almacenamiento | Liberar espacio |
| **Xcode** | Abrir Launchpad y buscar «Xcode» | Paso 2 |
| **Node.js 24 o superior** | En Terminal: `node -v` | Paso 3 |
| **git** | En Terminal: `git --version` | macOS ofrece instalarlo al escribirlo; aceptad |

No hacen falta CocoaPods, ni cuenta de desarrollador de Apple, ni el servidor de Pinky Pet: la app usa el que ya está publicado en Render.

## 2. Instalar Xcode (una sola vez)

1. **App Store** → buscar **Xcode** → **Obtener**. Pide el Apple ID y ocupa ≈ 15 GB.
2. **Abrir Xcode una vez.** Pregunta qué plataformas instalar: marcad **iOS** (el simulador) y esperad a que termine.
   - Si no lo pregunta: **Xcode → Settings → Components** → junto a **iOS**, pulsad **Get**.
3. En la app **Terminal** (piden la **contraseña del Mac**, que no se ve al escribirla):
   ```
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```
4. Comprobación: `xcodebuild -version` debe mostrar «Xcode 26…» (o la versión instalada).

## 3. Instalar Node.js (si `node -v` falla o da menos de 24)

Descargad el instalador **LTS** de <https://nodejs.org> (el botón verde, archivo `.pkg`) y seguid el asistente. Después cerrad y volved a abrir la Terminal.

## 4. Descargar el proyecto e instalar sus dependencias

En la Terminal:
```
cd ~/Desktop
git clone https://github.com/pinkypetsapp1-create/pinkypet.git
cd pinkypet/app
npm ci
```
`npm ci` descarga las librerías de la app (≈ 2–3 minutos). Los avisos en amarillo (`warn`) son normales.

## 5. Preparar la app para iOS y abrirla en el simulador

Desde `pinkypet/app`:
```
npx ng build
npx cap sync ios
npx cap run ios
```
- `ng build`: prepara la app en modo producción, conectada al servidor de Render.
- `cap sync ios`: copia la app dentro del proyecto de Xcode.
- `cap run ios`: muestra una lista de iPhones. Elegid uno con las flechas (por ejemplo, un **iPhone 17**) y pulsad Intro. Se abre el simulador y se instala Pinky Pet.

La primera vez tarda varios minutos, porque Xcode descarga y compila los paquetes de Capacitor.

**Otra forma, desde Xcode:** `npx cap open ios` abre el proyecto. Arriba, en el centro, elegid un iPhone del simulador y pulsad **▶︎**.

## 6. Qué esperar

- **La primera pantalla puede tardar hasta un minuto** si el servidor de Render estaba dormido (plan gratuito). Después va normal.
- Funciona todo igual que en Android y en la web: registro, test, compatibles, solicitud, recuperar contraseña…
- **«Continuar con Google» no aparece en iOS**, porque necesita un cliente iOS en Google Cloud (ver el final de esta guía). Se puede entrar con correo y contraseña.
- Cuentas de prueba: las mismas que en la web.
- Modo oscuro en el simulador: **Settings → Developer → Dark Appearance**, o en Xcode **Features → Toggle Appearance** (⇧⌘A).
- Letra grande: en el simulador, **Settings → Accessibility → Display & Text Size → Larger Text**.
- Captura de pantalla del simulador: **⌘ S** (se guarda en el Escritorio).

## 7. Si algo falla

| Mensaje | Solución |
|---|---|
| `xcodebuild requires Xcode, but active developer directory … CommandLineTools` | Falta el primer comando del paso 2.3 |
| `No available simulators` o la lista sale vacía | Xcode → Settings → Components → instalar **iOS** |
| `You have not agreed to the Xcode license` | `sudo xcodebuild -license accept` |
| `node: command not found` | Paso 3 y volver a abrir la Terminal |
| La app se queda en blanco o «sin conexión» | Esperad un minuto (servidor dormido) y volved a abrirla |
| Error de firma («Signing… requires a development team») | Solo pasa con un iPhone real, no en el simulador. Ver el apartado 8 |

## 8. (Opcional) En un iPhone de verdad

1. Conectad el iPhone por cable y en el iPhone: **Ajustes → Privacidad y seguridad → Modo desarrollador → activar** (pide reiniciar).
2. `npx cap open ios` → en Xcode, panel izquierdo **App** → pestaña **Signing & Capabilities** → **Team** → **Add an Account…** con vuestro Apple ID (gratis).
3. Arriba, elegid vuestro iPhone y pulsad **▶︎**. La primera vez, en el iPhone: **Ajustes → General → VPN y gestión de dispositivos → confiar** en vuestro Apple ID.

Con un Apple ID gratuito la app caduca a los 7 días; se vuelve a instalar igual.

## 9. Si se cambia algo de la app

Después de cualquier cambio en el código (o de hacer `git pull` para traer cambios del equipo):
```
cd pinkypet/app
git pull
npm ci
npx ng build && npx cap sync ios
npx cap run ios
```
No subáis a GitHub la carpeta `app/ios/App/App/public`: se genera sola (ya está en `.gitignore`).

---

### Para más adelante: «Continuar con Google» en iOS

1. Google Cloud → proyecto **Pinky Pet** → Google Auth Platform → **Clientes → Crear cliente → iOS** → ID del paquete `es.pinkypet.app`.
2. Poner su **ID de cliente** en `googleIosClientId` (`app/src/environments/environment.ts` y `environment.prod.ts`).
3. Añadir su **«iOS URL scheme»** (empieza por `com.googleusercontent.apps.`) en `app/ios/App/App/Info.plist`, en `CFBundleURLTypes`.

Claude lo puede hacer si se le pide.
