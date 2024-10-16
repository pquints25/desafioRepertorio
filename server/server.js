const express = require('express');
const hbs = require('hbs');
const path = require('path');


const app = express();

class Server {
    constructor(){
        this.app = express();
        this.port = 3000;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(__dirname.slice(0,-7) + '/views')
    }

    routes(){
        this.app.get('/api/canciones', require('../routes/cancion'))
        this.app.get('/', (req, res) => {
            res.render('index',{
                titulo: 'Repertorio',
                msg: 'Bienvenido a la Escuela de Musica E-Sueño'
            });
        });
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}



module.exports = Server;