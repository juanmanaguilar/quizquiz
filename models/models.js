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
// Inportar definición de tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar definición de tabla Comment en comment.js
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

// Definir relacion 1-a-N
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//exportar definición de tablas Quiz y Comment
exports.Quiz = Quiz; 
exports.Comment = Comment;

//sequelize.sync() crea e inicializa la tabla en BBDD
sequelize.sync().then(function(){
//success(..) ejecuta el manejador una vez creada la tabla. Con nuevas versiones success se cambia por then (promesas)
	Quiz.count().then(function (count){
		if (count === 0) { // Si la tabla está vacía, se inicializa
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma',
						  tema: 'Humanidades'
						});
			Quiz.create({ pregunta: 'Capital de Portugal',
						  respuesta: 'Lisboa',
						  tema: 'Humanidades'
						})
			.then(function() { console.log ('Base de datos inicializada')});
		};
	});
});