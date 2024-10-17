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
        this.app.use('/api/canciones', cancion);
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
