const {findAll, findByArtista, insert, update, deleteById} = require('../service/cancion');

const findAllController = async (req, res) => {
    const result = await findAll();
    res.render('index', { canciones: result.datos});
    };
    


const findByArtistaController = async (req, res) => {
    const artista = req.query.artista;
    const result = await cancion.findByPk(artista);
    res.render('index', {
        result
    });
    }

const preInsertController = (req, res) => {
    res.render('insert')
}

const insertController = async (req, res) => {
    const titulo = req.body.titulo;
    const artista = req.body.artista;
    const tono = req.body.tono;
    const result = await insert(titulo, artista, tono);
    res.redirect('/');

    const nuevaCancion = await Cancion.create({
        titulo, artista, tono
    });
    res.render('/', {
        result
    });
}

const preUpdateController = async (req, res) => {
    const artista = req.query.artista;
    const result = await findByPk(artista);
    result.datos = result.datos[0];
    res.render('update', {
        result
    });
}

const updateController = async (req, res) => {
    const id = req.body.id;
    const titulo = req.body.titulo;
    const artista = req.body.artista;
    const tono = req.body.tono;
    const result = await update(id, titulo, artista, tono);
    res.render('index', {
        result
    });
};

const deleteByIdController = async (req, res) => {
    const id = req.query.id;
    const result = await deleteByid(id);
    res.render('index', {
        result
    });
};

module.exports = {
findAllController,
findByArtistaController,
preInsertController,
insertController,
preUpdateController,
updateController,
deleteByIdController
};
