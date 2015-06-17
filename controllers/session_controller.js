exports.loginRequired = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

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
		//Establecemos hora de expiración en milisegundos
		req.session.horaExpira = (new Date()).getTime() + 30000;
		// Redireccion a path anterior a login
		res.redirect(req.session.redir.toString()); 
	});
};

//DELETE /logout -- Destruir sesion
exports.destroy = function (req, res) {
	var pathAnterior = req.session.redir.toString(); //Guarda el path antes de cerrar la sesion 
	delete req.session.user;
	res.redirect(pathAnterior); // Funciona con logout, pero cuando se pulsa un enlace y la sesion ha expirado hay que recargar
								// si el enlace pulsado es loginRquired primero va a login y despues al path anterior
};