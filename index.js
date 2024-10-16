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