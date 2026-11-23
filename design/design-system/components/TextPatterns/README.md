# TextPatterns
Patrones de texto del wireframe que no tienen un componente M3 propio y se resuelven solo con la escala tipográfica y los roles de color.

**Familias:** los estilos display, headline y title-large van en **Fraunces** (título de pantalla, encabezado de sección, encabezado de bloque, titular de resultado); el resto, en **Roboto**. Las cifras («92 %», «34 %») van siempre en Roboto aunque midan 22/28: son datos, no títulos.

| Patrón | Clase | Estilo | Espaciado | Pantallas |
|---|---|---|---|---|
| Título de pantalla | `pp-screen-title` | headline-large-emphasized | 16 bajo la barra superior y hasta el texto siguiente | Mascotas, Cómo adoptar, Mi perfil, Registro, Iniciar sesión, nombre en la Ficha |
| Texto introductorio | `pp-intro` | body-large | 24 hasta la siguiente sección | Test, Registro, Iniciar sesión, Mi perfil, Estado |
| Encabezado de sección | `pp-section-title` | title-large | 24 antes y 12 hasta su contenido | Inicio, Ficha, Cómo adoptar |
| Encabezado de bloque del test | `pp-block-head` | title-large-emphasized + body-small + divisor | 4 entre título y meta, 8 hasta el divisor | Test |
| Lista con viñetas | `pp-bullets` | body-large | sangría de 20, 8 entre elementos | Sin uso: los requisitos de Cómo adoptar pasaron a Checklist (UX7) |
| Metadatos de la mascota | `pp-meta` | body-large, on-surface-variant | 4 bajo el nombre | Ficha |
| Titular de resultado | `pp-result-title` | headline-small | 8 hasta el mensaje | Estado (finalizada, no disponible, cancelada) |
| Texto de ayuda o estado | `pp-hint` | body-small, on-surface-variant | — | Test, Ficha («Si un dato no se conoce…») |
| Contador de resultados | `pp-count` | title-small | 12 hasta la rejilla | Mascotas |
| Nota con icono | `pp-note` | body-medium, on-surface-variant + `check_circle` de 20 en `primary`; arranque en negrita (on-surface, 500) | 12 sobre la nota | Inicio («Qué significa el resultado») |

## Fuente
Wireframe de fidelidad media: todas las pantallas.
