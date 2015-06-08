var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null,
							{ dialect: "sqlite",
							  storage: "quiz.sqlite" 
							});
// Inportar de finición de tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz; //exportar definición de tabla Quiz

//sequelize.sync() crea e inicializa la tabla en BBDD
sequelize.sync().success(function(){
//success(..) ejecuta el manejador una vez creada la tabla. Con nuevas versiones success se cambia por then (promesas)
	Quiz.count().success(function (count){
		if (count === 0) { // Si la tabla está vacía, se inicializa
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.success(function() { console.log ('Base de datos inicializada')});
		};
	});
});