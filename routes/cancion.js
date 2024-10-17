const { Router } = require('express')
const { findAllController, findByPkController , insertController, updateController, deleteByIdController, preInsertController, preUpdateController} = require('../controllers/cancion');

const router = Router();

router.get('/', findAllController); 

router.get('/findByPk', findByPkController);

router.post('/insert', preInsertController)

router.post('/insert', insertController) 

router.post('/update', preUpdateController) 

router.post('/update', updateController)

router.get('/deleteById', deleteByIdController)  

module.exports = router;
