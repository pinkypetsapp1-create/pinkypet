# TestResults
Tarjeta outlined de la ficha que explica la compatibilidad con la mascota. Va **justo debajo de la cabecera**, antes de la información general: es la razón de ser de la app y antes quedaba al final, detrás de 8 filas de datos.

## Anatomía
1. Título «Resultados de tu test» (`title-medium`).
2. `CompatibilityMeter` con «Según tus respuestas en los 3 bloques del test.».
3. **Barras por bloque**: Mi hogar, Mi día a día y La mascota que busco, cada una con su porcentaje a la derecha y una barra fina de 4 px (activo `primary`, pista `surface-container-highest`, hueco y punto de parada). Se comparan de un vistazo, algo que la lista de texto no permitía.
4. **«Lo que encaja contigo»** y **«Para que os vaya bien»**, cada uno con una forma Expressive de 40 px en `secondary-container` y su icono en `on-secondary-container`: cookie-4 con `check` y soft-burst con `lightbulb`. Título en `title-small` y texto en `body-medium`.
5. Nota final en `body-small`: «Este resultado te orienta según tus respuestas. La protectora te ayudará a confirmar el encaje antes de la adopción.».

## Color
El malva (barras, cifra) y el verde (formas de los motivos) nunca se superponen: cada uno va con sus propios tonos.

## Accesibilidad
Las barras son decorativas: el porcentaje de cada bloque está en el texto (`<dl>`).

## Tokens
`surface-container-lowest`, `outline-variant`, `primary`, `surface-container-highest`, `secondary-container`, `on-secondary-container`, `on-surface`, `on-surface-variant`, `corner-medium`.

## Fuente
Wireframe de fidelidad media: Ficha de la mascota.
