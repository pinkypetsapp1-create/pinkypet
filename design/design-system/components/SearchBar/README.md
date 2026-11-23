# SearchBar
Barra de búsqueda en píldora de 56 px que lleva a Mascotas (o a Compatibles si el test está hecho). En Inicio va **justo debajo de la barra superior con el logotipo**, a ancho completo (8 px bajo la barra), como primer elemento del contenido. No lleva icono de cuenta ni de perfil dentro: solo `search` y el texto. Se descartó ponerla al lado del logotipo porque se quedaría en unos 220 px y el texto se cortaría.

## Anatomía
Icono `search` + «Buscar mascotas» en `body-large`, sobre `surface-container-high`.

## Accesibilidad
En el wireframe es un enlace (`<a aria-label="Buscar mascotas">`), no un campo para escribir.

## Tokens
`surface-container-high`, `on-surface-variant`, `corner-full`.

## Fuente
Wireframe de fidelidad media: Inicio.
