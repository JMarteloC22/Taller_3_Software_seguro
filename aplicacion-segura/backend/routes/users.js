// Archivo: backend/routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint para eliminar un usuario (vulnerable a escalada de privilegios)
router.delete('/:id', verifyToken, (req, res) => {
  const userIdToDelete = req.params.id;

  // 💡 Aquí pasamos el parámetro userIdToDelete como segundo argumento
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


router.get('/', (req, res) => {
  db.all('SELECT id, username, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
