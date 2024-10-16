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


