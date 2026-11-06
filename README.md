# Cursada Diseño UTDT

Tablero compartido para que la camada que empieza 4º año de la Licenciatura en Diseño de la UTDT en marzo de 2027 acomode sus materias de 4º y 5º año.

- Al entrar te ofrece anotarte: en qué cuatrimestre estás, qué materias debés (de un desplegable), cuántas optativas hiciste, cuáles pensás cursar (las escribís) y si te vas de intercambio.
- Cada persona edita solo su fila y ve la de todos. No hace falta cuenta: la fila queda atada al navegador donde te anotaste.
- Cada materia es un bloque que se arrastra entre 1C 2027, 2C 2027, 1C 2028 y 2C 2028, con una nota y dos switches: optativa u obligatoria, y si se debe de años anteriores.
- Avisa si una materia no se dicta en ese cuatrimestre, si una correlativa queda fuera de orden y si alguien no deja nada para el 2C 2028 (requisito para recibirse a fin de 2028).
- El cuatrimestre de intercambio se pinta de otro color y cada materia muestra con quién la compartís.

## Cómo está hecho

Es una página estática (HTML, CSS y JavaScript sin dependencias de build) publicada con GitHub Pages. Los datos se guardan en Cloud Firestore (Firebase), que avisa los cambios en vivo a todos los que tienen la página abierta.

Sin configurar Firebase, la página funciona en **modo prueba**: los cambios quedan solo en el navegador de cada persona.

## Conectar la base (una sola vez)

1. Entrá a https://console.firebase.google.com con una cuenta de Google y creá un proyecto (Google Analytics no hace falta).
2. En el menú, **Compilación > Firestore Database > Crear base de datos**. Elegí una ubicación (por ejemplo `southamerica-east1`) y empezá en **modo producción**.
3. En la pestaña **Reglas** de Firestore, pegá el contenido de [`firestore.rules`](firestore.rules) y tocá **Publicar**.
4. En **Compilación > Authentication > Comenzar > Método de acceso**, activá **Anónimo**. Es lo que permite que cada uno edite solo su fila sin crear una cuenta.
5. En **Configuración del proyecto** (el engranaje) > **Tus apps**, agregá una app **Web** (`</>`). No hace falta Firebase Hosting.
6. Copiá el objeto `firebaseConfig` que te muestra y pegalo en [`firebase-config.js`](firebase-config.js).
7. Subí el cambio. El tablero arranca vacío: cada persona entra, toca "Anotarme" y solo puede editar la fila que creó.

La `apiKey` de Firebase no es secreta: identifica el proyecto y lo que protege los datos son las reglas de `firestore.rules`.

## Cuidado

Cada fila se edita solo desde el navegador donde se creó. Nadie puede elegir ni editar la fila de otro. Si borrás los datos del navegador o cambiás de compu, tu fila queda de solo lectura. No hay historial de cambios. Lo que cargues lo ve cualquiera con el link: no pongas datos personales sensibles.

## Probar en tu compu

```bash
npx http-server@14.1.1 . -p 5190
```

Y abrí http://localhost:5190.

Fuente del plan: Plan de Estudios de la Carrera de Diseño, UTDT (indicativo).
