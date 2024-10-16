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
