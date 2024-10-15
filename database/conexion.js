const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/repertorio');


const conectarBd = async () => {
    try{
        await sequelize.authenticate();
        console.log('La conexion a la base de datos fue exitosa😎.');
    } catch(error) {
        console.log('La conexion a la base de datos fallo😒.', 
            error);
        
}
    
};

module.exports = sequelize;