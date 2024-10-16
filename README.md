//INDEX
const Server = require("./server/server");

const server = new Server();

/* sequelize.authenticate().then(() => {
    console.log('funcionando');
    
}) */ //comprobar si sequelize esta funcionando

server.listen();

/* const repertorio = require("./models/cancion")

repertorio.sync({alter:true}) *///sincronizar base de datos

/* const Cancion = require("./models/cancion");

Cancion.findAll(); */ //esto comprobara si podemos ejecutar las funciones 


//MODELS/CANCIONES.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexion');


const Cancion = sequelize.define('Cancion', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
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

//DATABASE/CONEXION.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/repertorio');

module.exports = sequelize;


//SERVICE/CANCION.js
const cancion = require("../models/cancion");

const findAll = async () => {
    try {
        const canciones = await cancion.findAll();
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
        const cancionEncontrada = await cancion.findByPk(id);
        if(cancionEncontrada === null){
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


const insert = async (titulo, artista, tono) => {
    try{
        const nuevaCancion = await cancion.create({titulo, artista, tono});
    return{
        msg: `La cancion de '${titulo}' de ${artista} se inserto correctamente`,
        status: 201,
        datos: [nuevaCancion.dataValues]
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
    await cancion.update(
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
    await cancion.destroy({ where:{id}});
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


//CONTROLLERS/CANCION.js
const cancion = require('../service/cancion');

const getCanciones = async (req, res) => {
    const result = await cancion.findAll();
    res.status(result.status).json(result);
};

const getCancionById = async (req, res) => {
    const {id} = req.params;
    const result = await cancion.findById(id);
    res.status(result.status).json(result);
};

const createCancion = async (req, res) => {
    const {titulo, artista, tono} = req.body;
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


//ROUTES/CANCION.js
const express = require('express');
const router = express.Router();
const cancionController = require('../controllers/cancion');

router.get('/', cancionController.getCanciones);
router.get('/:id', cancionController.getCancionById);
router.post('/', cancionController.createCancion);
router.put('/:id', cancionController.updateCancion);
router.delete('/:id', cancionController.deleteCancion);

module.exports = router;

//SERVER/SERVER
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const cancion = require('../routes/cancion')

const app = express();

class Server {
    constructor(){
        this.app = express();
        this.port = 3001;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(__dirname.slice(0,-7) + '/views/partials')
    }

    routes(){
        this.app.get('/api/canciones', require('../routes/cancion'))
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
module.exports = Server;

//VIEWS/INDEX.HBS
<!DOCTYPE html>
<html lang="es">
{{> head }}

<body>
    <div id="AgregarCancion">
        <h2 class="pt-3">&#119070; Mi repertorio &#119070;</h2>

        <div class="container pt-5 w-50">
            <div>
                <div class="form-group row">
                    <label for="cancion" class="col-sm-2 col-form-label">Canción:</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="cancion" placeholder="Título de la canción" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="artista" class="col-sm-2 col-form-label">Artista: </label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="artista" placeholder="Nombre del artista" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="tono" class="col-sm-2 col-form-label">Tono:</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="tono" placeholder="Tono de la canción" />
                    </div>
                </div>
                <button onclick="nuevaCancion()" id="agregar" class="m-auto btn btn-success">Agregar</button>
                <button onclick="editarCancion()" id="editar" class="m-auto btn btn-info" disabled>Editar</button>
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
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody id="cuerpo"></tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>

    <script>
        const apiUrl = 'http://localhost:3001/api/canciones'; // Cambia la URL según tu configuración

        async function obtenerCanciones() {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (data.status === 200) {
                    const cuerpo = document.getElementById('cuerpo');
                    cuerpo.innerHTML = ''; // Limpiar tabla antes de agregar nuevas filas
                    data.datos.forEach((cancion, index) => {
                        cuerpo.innerHTML += `
                            <tr>
                                <th scope="row">${index + 1}</th>
                                <td>${cancion.titulo}</td>
                                <td>${cancion.artista}</td>
                                <td>${cancion.tono}</td>
                                <td>
                                    <button class="btn btn-warning" onclick="cargarCancion(${cancion.id})">Editar</button>
                                    <button class="btn btn-danger" onclick="eliminarCancion(${cancion.id})">Eliminar</button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    console.log(data.msg);
                }
            } catch (error) {
                console.error('Error al obtener canciones:', error);
            }
        }

        async function nuevaCancion() {
            const titulo = document.getElementById('cancion').value;
            const artista = document.getElementById('artista').value;
            const tono = document.getElementById('tono').value;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ titulo, artista, tono }),
                });
                const data = await response.json();
                alert(data.msg);
                obtenerCanciones(); // Actualizar la lista después de agregar
                limpiarCampos();
            } catch (error) {
                console.error('Error al agregar la canción:', error);
            }
        }

        function cargarCancion(id) {
            // Cargar canción para editar
            fetch(`${apiUrl}/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                        const cancion = data.datos[0];
                        document.getElementById('cancion').value = cancion.titulo;
                        document.getElementById('artista').value = cancion.artista;
                        document.getElementById('tono').value = cancion.tono;
                        document.getElementById('editar').onclick = () => actualizarCancion(id);
                        document.getElementById('editar').disabled = false; // Activar el botón de editar
                    } else {
                        alert(data.msg);
                    }
                })
                .catch(error => console.error('Error al cargar la canción:', error));
        }

        async function actualizarCancion(id) {
            const titulo = document.getElementById('cancion').value;
            const artista = document.getElementById('artista').value;
            const tono = document.getElementById('tono').value;

            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ titulo, artista, tono }),
                });
                const data = await response.json();
                alert(data.msg);
                obtenerCanciones(); // Actualizar la lista después de editar
                limpiarCampos();
                document.getElementById('editar').disabled = true; // Desactivar el botón de editar
            } catch (error) {
                console.error('Error al actualizar la canción:', error);
            }
        }

        async function eliminarCancion(id) {
            if (confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
                try {
                    const response = await fetch(`${apiUrl}/${id}`, {
                        method: 'DELETE',
                    });
                    const data = await response.json();
                    alert(data.msg);
                    obtenerCanciones(); // Actualizar la lista después de eliminar
                } catch (error) {
                    console.error('Error al eliminar la canción:', error);
                }
            }
        }

        function limpiarCampos() {
            document.getElementById('cancion').value = '';
            document.getElementById('artista').value = '';
            document.getElementById('tono').value = '';
            document.getElementById('editar').disabled = true; // Desactivar el botón de editar
        }

        // Cargar la lista de canciones al cargar la página
        window.onload = obtenerCanciones;
    </script>
</body>
</html>

//VIEWS/PARTIALS/HEAD.HBS
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            <title>{{e-sueno}}</title>
</head>
