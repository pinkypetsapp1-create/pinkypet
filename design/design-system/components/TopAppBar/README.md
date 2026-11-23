# TopAppBar
Barra superior pequeña de 64 px, en `surface`, con dos configuraciones.

## Variantes
- **Marca** (`pp-topbar pp-topbar--brand`): **imagotipo** (ver `Logo`): sello de 32 px en `primary` con la «p»-huella en negativo (`on-primary`, `pp-topbar__mark`, decorativo) + «Pinky Pet» en Fraunces 900, 22/28, `primary`, tracking −0,5 (`pp-topbar__title`). Pantallas raíz: Inicio, Mascotas, Cómo adoptar, Mi perfil, errores de Mascotas. El logotipo aparece siempre en las pantallas raíz.
- **Volver** (`pp-topbar`): `IconButton` `arrow_back` + título en `title-large` («Ficha de la mascota», «Test de compatibilidad», «Estado de la solicitud», «Iniciar sesión», «Registro»). El título se recorta con elipsis.

## Tono según scroll (Expressive)
Sin sombra ni borde: en reposo la barra es `surface`; en cuanto el contenido se desplaza bajo ella pasa a `surface-container` (`pp-topbar--scrolled`). Sin JS: `pp-scroll-scope` en la raíz de la pantalla, `pp-scroll-main` en el `<main>` que hace scroll y `pp-topbar--on-scroll` en la barra (scroll-driven animation, 8 px de recorrido).

## Tokens
`surface`, `surface-container`, `on-surface`, `primary`, `on-primary`.

## Accesibilidad
El sello es decorativo (`aria-hidden`); «Pinky Pet» es texto real. No es un enlace (resuelve la U9).

## Fuente
Wireframe de fidelidad media: todas las pantallas.
