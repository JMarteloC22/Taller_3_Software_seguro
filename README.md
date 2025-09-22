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

1. Ejecutar el comando:

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
