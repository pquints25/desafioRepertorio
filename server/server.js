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