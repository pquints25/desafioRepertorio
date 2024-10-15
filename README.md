##repertorio

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
//index
const Server = require("./server/server");

const server = new Server();

server.listen();

//server
const express = require('express');
const hbs = require('hbs');

const app = express();

class Server {
    constructor(){
        this.app = express();
        this.app.set('view engine', 'hbs');
        this.port = 3000;
    }

    middlewares(){

    }

    routes(){

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;

