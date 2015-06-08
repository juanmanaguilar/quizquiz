var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name	= (url[6]||null);
var user	= (url[2]||null);
var pwd 	= (url[3]||null);
var protocol= (url[1]||null);
var dialect = (url[1]||null);
var port 	= (url[5]||null);
var host 	= (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
							{ 	dialect: 	protocol,
							  	protocol: 	protocol,
							  	port: 		port,
							  	host: 		host,
							  	storage: 	storage, //solo SQLite (.env)
							  	omitNull: 	true     //Solo Postgres 
							});
// Inportar de finición de tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa la tabla en BBDD
sequelize.sync().then(function(){
//success(..) ejecuta el manejador una vez creada la tabla. Con nuevas versiones success se cambia por then (promesas)
	Quiz.count().then(function (count){
		if (count === 0) { // Si la tabla está vacía, se inicializa
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.then(function() { console.log ('Base de datos inicializada')});
		};
	});
});