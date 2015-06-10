var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var titController = require('../controllers/tit_controller')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// GET de /author
router.get('/author', titController.author);

//Autoload de comandos con :quizId
router.param('quizId', quizController.load);

//Rutas de quizes
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new',					quizController.new);
router.post('/quizes/create',				quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',	quizController.edit);
router.put('/quizes/:quizId(\\d+)',			quizController.update);



module.exports = router;