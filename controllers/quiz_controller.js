var models = require('../models/models.js')

// Autoload. Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz){
									if (quiz) {
										req.quiz = quiz;
										next(); }
									else { 
										next(new Error('No existe quizId= '+ quizId)); }
								}
								).catch(function(error) { next(error); });
};

//GET quizes
exports.index = function(req, res){
	
	if (req.query.search){
		models.Quiz.findAll( { where: ["pregunta like ?",('%'+req.query.search+'%')], order: ['pregunta'] })
							.then( function(quizes){
										res.render('quizes/index', { quizes: quizes, errors: [] });
									})
									.catch(function(error){next(error)});
		
	}
	else {
		models.Quiz.findAll()
							.then( function(quizes) {
								res.render('quizes/index', { quizes: quizes, errors: [] });
							}).catch(function(error){next(error)});
	}
};

//GET /quizes/:id
exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
							res.render('quizes/show', {quiz: req.quiz, errors: [] });
						});
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
	};

exports.new = function(req, res) {
	var quiz = models.Quiz.build( //Crea el objeto quiz
			{ pregunta: "Pregunta", respuesta: "Respuesta"});
	res.render('quizes/new', {quiz: quiz, errors: [] });
};

//POST /quizes/create
exports.create = function(req, res){
	var	quiz = models.Quiz.build ( req.body.quiz );
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors });
			}
			else {
				// save: Guarda en BBDD los campos pregunta y respuesta de quiz
				quiz
					.save({ fields: ["pregunta", "respuesta"] })
					.then(function (){ res.redirect('/quizes') })
			}
		});
	};
// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz;
	res.render('quizes/edit', { quiz: quiz, errors: [] })
};

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', { quiz: req.quiz, errors: err.errors })
			}
			else {  // Guardamos y volvemos a la lista
				req.quiz
				.save( { fields: ["pregunta", "respuesta"] })
				.then( function (){ res.redirect('/quizes'); });
			}
		}
	);
};
