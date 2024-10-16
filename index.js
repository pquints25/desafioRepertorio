const Server = require("./server/server");
const sequelize = require('sequelize')
const server = new Server();

// <> Para sincronizar con mi BBDD
sequelize.sync({ alter: true })
.then(() => {
    console.log("Las tablas existentes se han sincronizado.");
})
.catch(err => {
    console.error("Error al sincronizar la tabla:", err);
});


server.listen();