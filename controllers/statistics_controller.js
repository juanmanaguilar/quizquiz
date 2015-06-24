var models = require('../models/models.js');

var errors = [];

var statistics = {  totalQuiz: 0, totalComment: 0, preCon: 0 };
//GET /quizes/statistics
exports.show = function(req, res) {
	statistics.totalQuiz = 0;
	models.Quiz.findAll()
		.then (function(quizes){			
			statistics.totalQuiz = quizes.length;
			for (var i = 0; i < quizes.length; i++) {
				models.Comment.findAll ( { where: { QuizId: quizes[i].id, publicado: true } })
					.then( function (commentsPP){
						if (commentsPP.length > 0){
							statistics.preCon++;
							statistics.totalComment += commentsPP.length;
						}
					})						
					.catch(function(error){ next(error); });

			};
			console.log(statistics.totalQuiz+' Preguntas '+statistics.preCon+' con comentarios '+statistics.totalComment+' publicados' );
			res.render('quizes/statistics', 
						{ statistics: statistics, errors: [] });
			statistics.totalComment = 0;
			statistics.preCon = 0;	
		})
		.catch(function(error){ next(error); })			;
};