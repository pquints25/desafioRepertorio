const cancion = require("../models/cancion");

const findAll = async () => {
    try {
        const canciones = await cancion.findAll();
        if (canciones.length == 0) {
            return {
                msg: 'No hay datos en la tabla',
                status: 204,
                datos: []
            };
        }
        return {
            msg: 'Los datos consultados son:',
            status: 200,
            datos: canciones.map(cancion => cancion.dataValues)
        };
    } catch (error) {
        console.log(error.message);
        return {
            msg: 'Error en el servidor',
            status: 500,
            datos: []
        };
    }
};

const findByPk = async (id) => {
    try{
        const cancionEncontrada = await cancion.findByPk(id);
        if(cancionEncontrada == 0){
            return{
                msg: `La cancion con ID ${id} no existe`,
                status: 204,
                datos: []
            };
        }
        return {
            msg: `La cancion con ID ${id} existe`,
            status: 200,
            datos: [cancionEncontrada.dataValues]
        };
    } catch (error){
        console.log(error.message);
        return{
            msg: 'Error en el servidor',
            status: 500,
            datos: []
        };
        
    }
};   


const insert = async (titulo, artista, tono) => {
    try{
        const nuevaCancion = await cancion.create({titulo, artista, tono});
    return{
        msg: `La cancion de '${titulo}' de ${artista} se inserto correctamente`,
        status: 201,
        datos: [nuevaCancion.dataValues]
    };
    } catch (error){
        console.log(error.message);
        return{
            msg: 'Error en el servidor',
            status: 500,
            datos: []
        };
    }
} 

const update = async (id, titulo, artista, tono) => {
try{
    await cancion.update(
        { titulo, artista, tono},
        {where: {id} }
    );
    return {
        msg: `La cancion con ID ${id} se actualizo correctamente`,
        status: 200,
        datos:[]
    };
}  catch(error) {
    console.log(error.message);
    return{
        msg: 'Error en el servidor',
        status: 500,
        datos: []
        };  
    }
};

const deleteById = async (id) => {
try{
    await cancion.destroy({ where:{id}});
    return{
        msg:`La cancion con ID ${id} se elimino correctamente`,
        status: 200,
        datos:[]
    };
} catch (error){
    console.log(error.message);
    return{
        msg: 'Error en el servidor',
        status: 500,
        datos: []
        };
    }
};

module.exports  = {
    findAll,
    findByPk,
    insert,
    update,
    deleteById  
};