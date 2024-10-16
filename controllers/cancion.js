const cancion = require('../service/cancion');

const getCanciones = async (req, res) => {
    const result = await cancion.findAll();
    res.status(result.status).json(result);
};

const getCancionById = async (req, res) => {
    const { id } = req.params;
    const result = await cancion.findById(id);
    res.status(result.status).json(result);
};

const createCancion = async (req, res) => {
    const { titulo, artista, tono } = req.body;
    const result = await cancion.insert(titulo, artista, tono);
    res.status(result.status).json(result);
};

const updateCancion = async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    const result = await cancion.update(id, titulo, artista, tono);
    res.status(result.status).json(result);
};

const deleteCancion = async (req, res) => {
    const { id } = req.params;
    const result = await cancion.deleteById(id);
    res.status(result.status).json(result);
};

module.exports = {
    getCanciones,
    getCancionById,
    createCancion,
    updateCancion,
    deleteCancion
};
