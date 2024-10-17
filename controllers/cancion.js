const cancion = require('../service/cancion');

const getCanciones = async (req, res) => {
    try {
        const result = await cancion.findAll();
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error al obtener las canciones:', error);
        res.status(500).json({ message: 'Error al obtener las canciones' });
    }
};

const getCancionById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cancion.findById(id);
        if (!result) {
            return res.status(404).json({ message: 'Canción no encontrada' });
        }
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error al obtener la canción por ID:', error);
        res.status(500).json({ message: 'Error al obtener la canción' });
    }
};

const createCancion = async (req, res) => {
    const { titulo, artista, tono } = req.body;
    try {
        const result = await cancion.insert(titulo, artista, tono);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error al crear la canción:', error);
        res.status(500).json({ message: 'Error al crear la canción' });
    }
};

const updateCancion = async (req, res) => {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    try {
        const result = await cancion.update(id, titulo, artista, tono);
        if (!result) {
            return res.status(404).json({ message: 'Canción no encontrada para actualizar' });
        }
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error al actualizar la canción:', error);
        res.status(500).json({ message: 'Error al actualizar la canción' });
    }
};

const deleteCancion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await cancion.deleteById(id);
        if (!result) {
            return res.status(404).json({ message: 'Canción no encontrada para eliminar' });
        }
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error al eliminar la canción:', error);
        res.status(500).json({ message: 'Error al eliminar la canción' });
    }
};

module.exports = {
    getCanciones,
    getCancionById,
    createCancion,
    updateCancion,
    deleteCancion
};
