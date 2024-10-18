const express = require('express');
const hbs = require('hbs');
const path = require('path');

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
        hbs.registerPartials(path.join(__dirname, '../views/partials'));
    }

    routes() {
        this.app.use('/canciones', require('../routes/cancion'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
