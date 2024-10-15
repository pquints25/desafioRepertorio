const express = require('express');
const bodyParser = require('body-parser');
const Cancion = require("../database/conexion");

app.use (bodyParser.json());

//post
app.post('/cancion', async (req, res) => {
    const { titulo, artista, cancion} = req.body;
    try{
    const nuevaCancion = await Cancion.create({titulo,artista,cancion});
    res.status(201).json(nuevaCancion);
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: `Error al agregar esta cancion 😢`})
    }
});

app.get('/cancion', () => {
    try{
        const canciones = Cancion.findAll();
        res.status(200).json(canciones);
    } catch (error){
        console.log('Error al obtener la cancion😒 que fuerte');
        
    }
    
})