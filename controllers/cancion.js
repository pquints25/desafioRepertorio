const cancionService = require('../service/cancion');

const getCanciones = async (req, res) => {
    const result = await cancionService.findAll();
    res.status(result.status).json(result);
};

const getCancionById = async (req, res) => {
    const {id} = req.params;
    const result = await cancionService.findById(id);
    res.status(result.status).json(result);
};

const createCancion = async (req, res) => {
    const {titulo, artista, tono} = req.body;
    const result = await cancionService.insert(titulo, artista, tono);
    res.status(result.status).json(result);
};

const updateCancion = async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    const result = await cancionService.update(id, titulo, artista, tono);
    res.status(result.status).json(result);
};

const deleteCancion = async (req, res) => {
    const { id } = req.params;
    const result = await cancionService.deleteById(id);
    res.status(result.status).json(result);
};

module.exports = {
    getCanciones,
    getCancionById,
    createCancion,
    updateCancion,
    deleteCancion
};