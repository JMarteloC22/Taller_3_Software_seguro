# Taller_3_Software_seguro
Presentación del taller 3, Desarrollo de Software Seguro, elaborado por **Jonathan Martelo**

---

## Despliegue del aplicativo

Para poder desplegar este aplicativo solo tiene que ejecutar los siguientes comandos:

```bash
git remote add taller https://github.com/JMarteloC22/Taller_3_Software_seguro/
git clone taller
```

Una vez ejecutados estos comandos se mostrarán los documentos básicos de funcionamiento del aplicativo.

## Ejecución del frontend

Para ejecutar el aplicativo debemos desplegar el front en un servidor local con el puerto **5000**, ejecutando:

```bash
cd frontend
npx serve -l 5000
```

> Es muy posible que este requiera la instalación de **npx**, solo digite **`Y`** y permita la instalación.

Este comando proporcionará un enlace de acceso. Acceda a este enlace y podrá abrir el documento **index** que permitirá la conexión con el backend.

## Ejecución del backend

En otra terminal (CMD) ejecute los siguientes comandos:

```bash
cd ..
cd backend
node server.js
```

Este debería mostrar el siguiente resultado:

```
[dotenv@17.2.2] injecting env (2) from .env -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar
✅ Conectado a la base de datos SQLite.
[dotenv@17.2.2] injecting env (0) from .env -- tip: ⚙️  override existing env vars with { override:  true }
🚀 Servidor escuchando en http://localhost:3000
```

Con estos pasos ya podrá acceder al aplicativo e interactuar con él sin problemas.
