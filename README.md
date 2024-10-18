//INDEX
const Server = require("./server/server");

const server = new Server();

server.listen();

//SERVICE/CANCION.JS
const cancion = require("../models/cancion");

const findAll = async () => {
    try {
        const canciones = await cancion.findAll();
        if (canciones.length == 0) {
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

const findByArtista = async (artista) => {
    try{
        const cancionEncontrada = await cancion.findByArtista({ where: {artista} });
        if(cancionEncontrada.length == 0){
            return{
                msg: `La cancion con ID ${artista} no existe`,
                status: 204,
                datos: []
            };
        }
        return {
            msg: `La cancion con artista ${artista} existe`,
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
        msg: `El artista con nombre ${artista} se inserto correctamente`,
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
        msg: `El artista con nombre ${artista} se actualizo correctamente`,
        status: 201,
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
        msg:`El id ${id} se elimino correctamente`,
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
    findByArtista,
    insert,
    update,
    deleteById  
};

//DATABASE/CONEXION.JS
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/repertorio');


module.exports = sequelize;

//SERVER/SERVER.JS
const express = require('express');
const hbs = require('hbs');
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
        this.app.use(express.urlencoded({ extended: true })); //capturar req.body
        this.app.set('view engine', 'hbs');
        this.app.use(express.json());
        hbs.registerPartials(__dirname.slice(0, -7) + '/views/partials');
    }

    routes() {
        this.app.get('/', (req, res) => {
            res.render('index'); 
        });
        this.app.get('/canciones', (req, res) => {
            cancionController.getCancionesView(req, res); // Asegúrate de que esto sea correcto
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;

//ROUTES/CANCION.JS
const { Router } = require('express')
const { findAllController, findByArtistaController , insertController, updateController, deleteByIdController, preInsertController, preUpdateController} = require('../controllers/cancion');

const router = Router();

router.get('/', findAllController); 

router.get('/findByArtista', findByArtistaController);

router.post('/pre-insert', preInsertController)

router.post('/insert', insertController) 

router.post('/pre-update', preUpdateController) 

router.post('/update', updateController)

router.get('/deleteById', deleteByIdController)  

module.exports = router;

//CONTROLLERS/CANCION.JS
const {findAll, findByArtista, insert, update, deleteById} = require('../service/cancion');

const findAllController = async (req, res) => {
    const canciones = await findAll();
    res.render('index', { result: {datos:canciones}});
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


//VIEWS/
<!DOCTYPE html>
<html lang="en">

{{>head}}

<body>
  <div id="AgregarCancion">
    <h2 class="pt-3">&#119070; Mi repertorio &#119070;</h2>

  <section>
        <div class="container pt-5 w-50">
      <form action="/insert" method="post"> {{!-- creo que aqui esta el problema, ver como unir el backend aqui --}}
        <div class="form-group row">
          <label for="titulo" class="form-label">Titulo</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="titulo" name="titulo"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="artista" class="form-label">Artista:</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="artista" name="artista"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="tono" class="form-label">Tono</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="tono" name="tono"/>
          </div>
        </div>
        <button type="submit" class="m-auto btn btn-success">Agregar</button>
      </form>
    </div>
  
  </section>


  <section>
    <div id="ListaCanciones">
    <h2>Tabla de canciones &#127908;</h2>
    </div>

    <div class="container pt-5 w-75">
      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">Identificar</th>
            <th scope="col">Canción</th>
            <th scope="col">Artista</th>
            <th scope="col">Tono</th>
            <th scope="col">Actualizar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {{#each result.datos}}
          <tr>
            <td>{{id}}</td>
            <td>{{titulo}}</td>
            <td>{{artista}}</td>
            <td>{{tono}}</td>
            <td><a href="/canciones/update?artista={{artista}}"><button class="btn btn-success">Actualizar</button></a></td>
            <td><a href="/canciones/deleteByPk?id={{id}}"><button class="btn btn-danger">Eliminar</button></a></td>
          </tr>
          {{/each}}
        </tbody>
      </table>
    </div>
  </section>



  <script>
    function prepararCancion(i, id) {
      document.getElementById("cancion").value = canciones[i].titulo;
      document.getElementById("artista").value = canciones[i].artista;
      document.getElementById("tono").value = canciones[i].tono;
      document.getElementById("agregar").style.display = "none";
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

  <style>
    body {
      text-align: center;
      background: #283593;
      color: white;
    }
  </style>

</body>

</html>

//VIEWS/
<!DOCTYPE html>
<html lang="en">
{{> head}}
<body>
    <section>
        <div class="container mt-3">
            <form action="/insert" method="post">
                <div class="mb-3">
                    <label for="titiulo" class="form-label">Titulo</label>
                    <input type="text" class="form-control" id="titulo" name="titulo">
                </div>
                <div class="mb-3">
                    <label for="artista" class="form-label">Artista</label>
                    <input type="text" class="form-control" id="artista" name="artista">
                </div>
                <div class="mb-3">
                    <label for="tono" class="form-label">Tono</label>
                    <input type="text" class="form-control" id="tono" name="tono">
                </div>
                <button type="submit" class="btn btn-primary">Insertar</button>
            </form>
        </div>
    </section>
</body>
</html>

//VIEWS
<!DOCTYPE html>
<html lang="en">
{{ >head }}
<body>
<section>
        <div class="container mt-3">
            <form action="/update" method="post">
                <div class="mb-3">
                    <label for="id" class="form-label">Identificador</label>
                    <input type="text" class="form-control" id="id" name="id" value="{{respuesta.datos.id}}">
                </div>
                <div class="mb-3">
                    <label for="titiulo" class="form-label">Titulo</label>
                    <input type="text" class="form-control" id="titulo" name="titulo" value="{{respuesta.datos.titulo}}">
                </div>
                <div class="mb-3">
                    <label for="artista" class="form-label">Artista</label>
                    <input type="text" class="form-control" id="artista" name="artista" value="{{respuesta.datos.artista}}">
                </div>
                <div class="mb-3">
                    <label for="tono" class="form-label">Tono</label>
                    <input type="text" class="form-control" id="tono" name="tono" value="{{respuesta.datos.tono}}">
                </div>
                <button type="submit" class="btn btn-primary">Actualizar</button>
            </form>
        </div>
    </section>
</body>
</html>

//VIEWS/PARTIALS/HEAD.HBS

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mi Repertorio</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
