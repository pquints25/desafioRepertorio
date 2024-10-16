const { DataTypes } = require('sequelize');
const sequelize = require('../database/conexion');

const Cancion = sequelize.define('Cancion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artista: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName:'canciones',
    timestamps:false,

});

module.exports = Cancion;