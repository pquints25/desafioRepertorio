const { Router } = require('express')

const router = Router();

router.get('/', (req, res) => {
    res.send('findAll')
}); 

router.get('/:id', (req, res) => {
    res.send('findByPk')
}); 
router.post('/', (req, res) => {
    res.send('insert')
});

router.put('/:id', (req, res) => {
    res.send('update')
});

router.delete('/:id', (req, res) => {
    res.send('deleteById')
}); 

module.exports = router;
