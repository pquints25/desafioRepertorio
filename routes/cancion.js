const express = require('express');
const router = express.Router();
const cancion = require('../controllers/cancion');

router.get('/', cancion.getCanciones);
router.get('/:id', cancion.getCancionById);
router.post('/', cancion.createCancion);
router.put('/:id', cancion.updateCancion);
router.delete('/:id', cancion.deleteCancion);

module.exports = router;