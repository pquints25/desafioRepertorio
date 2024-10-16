const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancion');

router.get('/', cancionController.getCanciones); 
router.get('/:id', cancionController.getCancionById); 
router.post('/', cancionController.createCancion); 
router.put('/:id', cancionController.updateCancion); 
router.delete('/:id', cancionController.deleteCancion); 

module.exports = router;
