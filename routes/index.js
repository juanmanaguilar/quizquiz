var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var titController = require('../controllers/tit_controller')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// GET de /author
router.get('/author', titController.author);

router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
module.exports = router;