//GET /login -- Formulario de login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('sessions/new', { errors: errors });
};

//POST /login -- Crear sesion
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){

		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("login");
			return;
		}
		//Crear req.session.user y guardar campos id y username
		//La sesion se define por la existencia de: req.session.user
		req.session.user = { id: user.id, username: user.username };

		res.redirect(req.session.redir.toString()); // Redireccion a path anterior a login //En teoría porque se va al /login
	});
};

//DELETE /logout -- Destruir sesion
exports.destroy = function (req, res) {
	delete req.session.user;
	var pathAnterior = req.session.redir.toString();
	res.redirect('login'); //He puesto que vuelva al login porque me da un error de demasiadas redirecciones que no he sabido resolver
//	res.redirect(req.session.redir.toString()); // Redireccion a path anterior a login/logout
//	res.redirect(pathAnterior);
};