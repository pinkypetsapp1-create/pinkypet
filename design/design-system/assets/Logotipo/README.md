# Logotipo

Isotipo de Pinky Pet: una «p» hecha con una huella (BR1). SVG de 100 × 100.

- `isotipo.svg`: principal, círculo `primary` (#734863) con la huella en blanco. Icono de la app, avatar, sello de la barra superior.
- `isotipo-invertido.svg`: círculo blanco con la huella en `primary`. Sobre fondos malva o fotos oscuras.
- `isotipo-una-tinta.svg`: círculo `on-surface` (#1C1B1B) con la huella en blanco. Impresión a una tinta.
- `huella-p.svg`: la huella sola en `primary`, sin círculo. Detalles gráficos; no a menos de 24 px.

En la interfaz, el sello de la barra se dibuja con CSS (`pp-topbar__mark` / `pp-mark`) para que siga los roles de color. También es la imagen de «Otros» en el selector de tipo (40 px, ILU3). Reglas completas en el componente `Logo`.
