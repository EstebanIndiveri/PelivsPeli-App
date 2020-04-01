var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var competenciasController = require ('./controlador/CompetenciasController');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Pedidos a la base de datos (primero query params)
app.get('/generos', competenciasController.cargarGeneros);
app.get('/directores', competenciasController.loadDirector);
app.get('/actores', competenciasController.loadActor);

app.get('/competencias/:id/peliculas', competenciasController.randomMovie);
app.post('/competencias/:idCompetencia/voto', competenciasController.saveVote);
app.get('/competencias/:id/resultados', competenciasController.getResultsVote);
app.get('/competencias/:id', competenciasController.competitionName);
app.get('/competencias', competenciasController.searchMovie);

app.post('/competencias', competenciasController.newCompetition);
app.put('/competencias/:id', competenciasController.editCompetition);

app.delete('/competencias/:id/votos', competenciasController.deleteVotes);
app.delete('/competencias/:idCompetencia', competenciasController.deleteCompetition);

var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});


