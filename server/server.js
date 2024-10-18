const express = require('express');
const hbs = require('hbs');


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
        this.app.get('/canciones', require("../routes/cancion")) 

        };
    

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
