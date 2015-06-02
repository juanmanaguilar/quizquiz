//GET /author
exports.author = function(req, res){
	res.render('author', { autor: 'Juan Aguilar', 
	email: 'juanmanaguilar@gmail.com', 
	github: 'https://github.com/juanmanaguilar' 
	});
};