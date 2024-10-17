//INDEX
const Server = require("./server/server");

const server = new Server();

const sequelize = require('./database/conexion');

sequelize.authenticate()
.then(() => console.log('Conexión a la base de datos establecida'))
.catch(err => console.error('Error al conectar con la base de datos:', err));

const Cancion = require('./models/cancion');
Cancion.sync({ alter: true })
.then(() => console.log('Modelo sincronizado'))
.catch(err => console.error('Error al sincronizar el modelo:', err));
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
            datos: [cancionEncontrada.dataValues]
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
const axios = require('axios');
const path = require('path');
const cancion = require('../routes/cancion');

class Server {
    constructor() {
        this.app = express();
        this.port = 3001;
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    routes() {
        this.app.use('/api/canciones', cancion);

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../views/index.html'));
        });

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;


//VIEWS/INDEX.HTML
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" />
</head>

<body>
  <div id="AgregarCancion">
    <h2 class="pt-3">&#119070; Mi repertorio &#119070;</h2>

    <div class="container pt-5 w-50">
      <div>
        <div class="form-group row">
          <label for="name" class="col-sm-2 col-form-label">Canción:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="cancion" value="A dios le pido" />
          </div>
        </div>
        <div class="form-group row">
          <label for="email" class="col-sm-2 col-form-label">Artista: </label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="artista" value="Juanes" />
          </div>
        </div>
        <div class="form-group row">
          <label for="rut" class="col-sm-2 col-form-label">Tono:</label>
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

  <script>
    let url = "/cancion";
    let tbody = document.getElementById("cuerpo");
    let cancion = document.getElementById("cancion");
    let artista = document.getElementById("artista");
    let tono = document.getElementById("tono");

    let canciones = [];
    window.onload = getData();

    async function getData() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Error al obtener datos: ' + response.statusText);
        }
        const data = await response.json();
        canciones = data;
        tbody.innerHTML = "";
        canciones.forEach((c, i) => {
          tbody.innerHTML += `
            <tr>
              <td>${i + 1}</td>
              <td>${c.titulo}</td>
              <td>${c.artista}</td>
              <td>${c.tono}</td>
              <td>
                <button class="btn btn-warning" onclick="prepararCancion(${i}, '${c.id}')">Editar</button>
                <button class="btn btn-danger" onclick="eliminarCancion(${i}, '${c.id}')">Eliminar</button>
              </td>
            </tr>
          `;
        });
        cancion.value = "";
        artista.value = "";
        tono.value = "";
      } catch (error) {
        console.error('Hubo un problema con la solicitud Fetch:', error);
        alert('Error al cargar las canciones.');
      }
    }

    function nuevaCancion() {
      const data = {
        titulo: cancion.value,
        artista: artista.value,
        tono: tono.value
      };

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al agregar canción: ' + response.statusText);
        }
        return response.json();
      })
      .then(() => getData())
      .catch(error => {
        console.error('Error al agregar canción:', error);
        alert('Error al agregar la canción.');
      });
    }

    function eliminarCancion(i, id) {
      fetch(`${url}?id=${id}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al eliminar canción: ' + response.statusText);
          }
          alert(`Canción ${canciones[i].titulo} eliminada`);
          getData();
        })
        .catch(error => {
          console.error('Error al eliminar canción:', error);
          alert('Error al eliminar la canción.');
        });
    }

    function prepararCancion(i, id) {
      cancion.value = canciones[i].titulo;
      artista.value = canciones[i].artista;
      tono.value = canciones[i].tono;
      document.getElementById("editar").setAttribute("onclick", `editarCancion('${id}')`);
      document.getElementById("agregar").style.display = "none";
      document.getElementById("editar").style.display = "block";
    }

    function editarCancion(id) {
      const data = {
        titulo: cancion.value,
        artista: artista.value,
        tono: tono.value
      };

      fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al editar canción: ' + response.statusText);
        }
        return response.json();
      })
      .then(() => {
        getData();
        document.getElementById("agregar").style.display = "block";
        document.getElementById("editar").style.display = "none";
      })
      .catch(error => {
        console.error('Error al editar canción:', error);
        alert('Error al editar la canción.');
      });
    }
  </script>

  <style>
    body {
      text-align: center;
      background: #283593;
      color: white;
    }
  </style>

</body>

</html>
