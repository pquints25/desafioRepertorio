const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/conexion');


const Cancion = sequelize.define('Cancion', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(50)
        },
    artista: {
        type: DataTypes.STRING(50)
        },
    tono: {
        type: DataTypes.STRING(10)
    },
}, {
    tableName:'canciones',
    timestamps:false,

});

module.exports = Cancion;