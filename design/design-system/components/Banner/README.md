# Banner
Aviso de error en línea, con `role="alert"`.

## Variantes
- **Error** (`pp-banner`): `error-container`, icono `error` relleno en `error` y texto en `label-large`. Textos del wireframe:
  - «El correo o la contraseña no son correctos. Revísalos e inténtalo de nuevo.»
  - «Revisa los 2 campos marcados para crear tu cuenta.»
  - El resumen de preguntas sin responder del test.
- **Error con acción** (`pp-banner pp-banner--action`): el mensaje más un botón outlined S. Ejemplo: «Ya existe una cuenta con este correo.» → «Iniciar sesión con este correo». Va bajo el campo y está enlazado con su `aria-describedby`.

## Tokens
`error-container`, `on-error-container`, `error`, `outline-variant`, `corner-medium`.

## Fuente
Wireframe de fidelidad media: Login con error, Registro con errores, Registro con correo existente, Test con errores.
