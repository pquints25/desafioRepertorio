##repertorio
//routes
const express = require('express');
const router = express.Router();
const cancion = require('../controllers/cancion');

router.get('/', cancion.getCanciones);
router.get('/:id', cancion.getCancionById);
router.get('/', cancion.createCancion);
router.get('/:id', cancion.updateCancion);
router.get('/:id', cancion.deleteCancion);

module.exports = router;

//conexion
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/repertorio');


const conectarBd = async () => {
    try{
        await sequelize.authenticate();
        console.log('La conexion a la base de datos fue exitosa😎.');
    } catch(error) {
        console.log('La conexion a la base de datos fallo😒.', 
            error);
        
}
    
};

module.exports = sequelize;

//server
const express = require('express');
const hbs = require('hbs');
const path = require('path');


const app = express();

class Server {
    constructor(){
        this.app = express();
        this.port = 3000;
        this.middlewares();
        
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(__dirname.slice(0,-7) + '/views')
    }

    routes(){
        this.app.get('/', (req, res) => {
            res.render('index',{
                titulo: 'Repertorio',
                msg: 'Bienvenido a la Escuela de Musica E-Sueño'
            });
        });
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}

//models//cancion
const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexion');

const Cancion = sequelize.define('Cancion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artista: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName:'canciones',
    timestamps:false,

});

module.exports = Cancion;

//controllers
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

//service
const cancion = require("../models/cancion");

const findAll = async () => {
    try {
        const canciones = await Cancion.findAll();
        if (canciones.length === 0) {
            return {
                msg: 'No hay datos en la tabla',
                status: 204,
                datos: []
            };
        }
        return {
            msg: 'Los datos consultados son:',
            status: 200,
            datos: canciones.map(cancion => cancion.dataValues)
        };
    } catch (error) {
        console.log(error.message);
        return {
            msg: 'Error en el servidor',
            status: 500,
            datos: []
        };
    }
};

const findById = async (id) => {
    try{
        const cancion = await Cancion.findById(id);
        if(cancion === null){
            return{
                msg: `La cancion con ID ${id} no existe`,
                status: 204,
                datos: []
            };
        }
        return {
            msg: `La cancion con ID ${id} existe`,
            status: 200,
            datos: [cancion.dataValues]
        };
    } catch (error){
        console.log(error.message);
        return{
            msg: 'Error en el servidor',
            status: 500,
            datos: []
        };
        
    }
};   


const insert = (titulo, artista, tono) => {
    try{
        const cancion = Cancion.create({titulo, artista, tono});
    return{
        msg: `La cancion de '${titulo}' de ${artista} se inserto correctamente`,
        status: 201,
        datos: [cancion.dataValues]
    };
    } catch (error){
        console.log(error.message);
        return{
            msg: 'Error en el servidor',
            status: 500,
            datos: []
        };
    }
} 

const update = async (id, titulo, artista, tono) => {
try{
    await Cancion.update(
        { titulo, artista, tono},
        {where: {id} }
    );
    return {
        msg: `La cancion con ID ${id} se actualizo correctamente`,
        status: 200,
        datos:[]
    };
}  catch(error) {
    console.log(error.message);
    return{
        msg: 'Error en el servidor',
        status: 500,
        datos: []
        };  
    }
};

const deleteById = async (id) => {
try{
    await Cancion.destroy({ where:{id}});
    return{
        msg:`La cancion con ID ${id} se elimino correctamente`,
        status: 200,
        datos:[]
    };
} catch (error){
    console.log(error.message);
    return{
        msg: 'Error en el servidor',
        status: 500,
        datos: []
        };
    }
};

module.exports  = {
    findAll,
    findById,
    insert,
    update,
    deleteById  
};

//hbs
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi Repertorio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>

<body>
    <div id="AgregarCancion">
        <h2 class="pt-3">&#119070; Mi repertorio &#119070;</h2>

        <div class="container pt-5 w-50">
            <div>
                <div class="form-group row">
                    <label for="cancion" class="col-sm-2 col-form-label">Canción:</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="cancion" value="A dios le pido" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="artista" class="col-sm-2 col-form-label">Artista: </label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="artista" value="Juanes" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="tono" class="col-sm-2 col-form-label">Tono:</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="tono" value="Em" />
                    </div>
                </div>
                <button onclick="nuevaCancion()" id="agregar" class="m-auto btn btn-success">
                    Agregar
                </button>
                <button onclick="editarCancion()" id="editar" class="m-auto btn btn-info">
                    Editar
                </button>
            </div>
        </div>
    </div>
    <div id="ListaCanciones">
        <hr />
        <hr />
        <h2>Tabla de canciones &#127908;</h2>

        <div class="container pt-5 w-75">
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Canción</th>
                        <th scope="col">Artista</th>
                        <th scope="col">Tono</th>
                        <th scope="col">-</th>
                    </tr>
                </thead>
                <tbody id="cuerpo"></tbody>
            </table>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
</body>

</html>