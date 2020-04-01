var con = require('../lib/conexionbd');

var controller = {

    //listo todas las competencias
    searchMovie: function (request, response) {
        /* La query sin parametro trae toda la base*/
        var sql = "SELECT * FROM competencia";
        /*catch del error y el result*/
        con.query(sql, function(error, result, fields) {
            if (error) {
                console.log("Ocurrió un error al cargar las peliculas,intenta nuevamente", error.message);
                return res.status(404).send("Ocurrió un error en la carga de películas, intenta nuevamente");
            }
            /*response con el resultado de la query*/
            response.send(JSON.stringify(result));
            console.log(result);
        });
    },

    /*se traen dos resultados aleatorios de la DB*/
    randomMovie: function (request, res) {
        var idCompetencia = request.params.id;
        var queryCompetencia = "SELECT nombre, genero_id, director_id, actor_id FROM competencia WHERE id = " + idCompetencia + ";";
        con.query(queryCompetencia, function(error, competencia, fields){
            if (error) { 
                console.log("Ocurrío un error al cargar los datos, intenta nuevamente", error.message);
                return res.status(500).send("Hubo un error no se encontró la pelicula, intenta nuevamente");
            }

            var MovieQuery = "SELECT DISTINCT pelicula.id, poster, titulo, genero_id FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id LEFT JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id WHERE 1 = 1";
            /*ubicamos a cada actor, genero y director por su id de tabla:*/
                var genero = competencia[0].genero_id;
                var actor = competencia[0].actor_id;
                var director = competencia[0].director_id;
                /*se modifican las querys con las variables*/
            var queryGenre = genero ? ' AND pelicula.genero_id = '  + genero : '';
            var queryAct = actor ? ' AND actor_pelicula.actor_id = ' + actor : '';
            var randomOrder = ' ORDER BY RAND() LIMIT 2';/* USAMOS EL METODO RANDOM Y LIMITAMOS A 2 LA respuesta*/
            var queryDirector = director ? ' AND director_pelicula.director_id = ' + director : '';
            var queryFinal = MovieQuery + queryGenre + queryAct + queryDirector + randomOrder;

            con.query(queryFinal, function(error, peliculas, fields){
                if (error) {
                    console.log("Parece que ocurrió un problema, intenta nuevamente", error.message);
                    return res.status(500).send("Parece que ocurrió un problema al cargar la pelicula intenta nuevamente");
                }
                /*liberamos la response con los dos alias que llama el front*/
               var response = {
                    'peliculas': peliculas,
                    'competencia': competencia[0].nombre
                };
                /* mandamos al fron las 2 peliculas como result */
                res.send(JSON.stringify(response));
            });
        });
    },

    //PASO4:
    /* Obtenemos el voto lo insertamos a la tabla:*/
    saveVote: function (request,res){
        /*Query que inserta el voto del front en la tabla con el id seleccionado del body.*/
        var idCompetencia= request.params.idCompetencia;
        var idPelicula = request.body.idPelicula;
        var sqlVote = "INSERT INTO voto (competencia_id, pelicula_id) values (" + idCompetencia + ", " + idPelicula + ")";

        con.query(sqlVote, function(error, result, fields) {
            if (error) {
                console.log("No se pudo realizar el voto, intenta nuevamente", error.message);
                return res.status(500).send("No se pudo realizar la votación intenta nuevamente más tarde");
            }
            /*se pasa el resultado con el id al alias voto.*/
            var response = {
                'voto': result.insertId,
            };
            /*se presenta la respuesta del voto finalmente*/
            res.status(200).send(response);    
        });
    },

    /*# PASO 5 */
    getResultsVote: function (request,res){
        var idCompetencia = request.params.id; 
        var sqlResults = "SELECT * FROM competencia WHERE id = " + idCompetencia;
        
        con.query(sqlResults, function(error, result, fields) {
            if (error) {
                console.log("Ocurrió un error al buscar las peliculas, intenta nuevamente", error.message);
                return res.status(500).send("Ocurró un error en la busqueda, intenta nuevamente");
            }
    
            if (result.length === 0) {
                console.log("No existen competencias vigentes");
                return res.status(404).send("No existen competencias vigentes");
            }
    
            var competencia = result[0];
    
            var sqlResults = "SELECT voto.pelicula_id, pelicula.poster, pelicula.titulo, COUNT(pelicula_id) As votos FROM voto INNER JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE voto.competencia_id = " + idCompetencia + " GROUP BY voto.pelicula_id ORDER BY COUNT(pelicula_id) DESC LIMIT 3";
    
            con.query(sqlResults, function(error, result, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }
    
                var response = {
                    'competencia': competencia.nombre,
                    'resultados': result
                };
               
                res.send(JSON.stringify(response));    
            });             
        });
    },
    
    /*crea una nueva competicion*/
    newCompetition: function (request, response){
        var nombreCompetencia = request.body.nombre;
        var generoCompetencia = request.body.genero === '0' ? null : request.body.genero;
        var directorCompetencia = request.body.director === '0' ? null : request.body.director;
        var actorCompetencia = request.body.actor === '0' ? null : request.body.actor;
        
        var NewSql = "INSERT INTO competencia (nombre, genero_id, director_id, actor_id) VALUES ('" + nombreCompetencia + "', " + generoCompetencia + ", " + directorCompetencia + ", " + actorCompetencia + ");";
        console.log(NewSql);
        
        con.query(NewSql, function(err, result, fields) {
            if (err) {
                console.log("Ocurrió un error al crear la competencia, intenta nuevamente", err.message);
                return response.status(500).send("Ocurrió un error al crear la competencia, intenta nuevamente");
            }
            response.send(JSON.stringify(result));
        }); 
    },
        
        
    /*limpia los votos*/
    deleteVotes: function (request, response){
        var idCompetencia = request.params.id;
        var deletes = "DELETE FROM voto WHERE competencia_id = " + idCompetencia;
        con.query(deletes, function (err, result){
            if (err) {
                console.log("Error al eliminar eliminar los votos, intenta nuevamente", err.message);
                return response.status(500).send(err);
            }
            response.send(JSON.stringify(result));
        });
    },

    /*nombre de la competición realizada.*/
    competitionName: function (request, res){
        var competitionName = request.params.id;
        var query = "SELECT competencia.id, competencia.nombre, genero.nombre genero, director.nombre director, actor.nombre actor FROM competencia LEFT JOIN genero ON genero_id = genero.id LEFT JOIN director ON director_id= director.id LEFT JOIN actor ON actor_id= actor.id WHERE competencia.id = " + competitionName;
        con.query(query, function(err, result){
            if (err) {
                console.log("Ocurrió un error al obtener el nombre de la competición", err.message);
                return res.status(500).send("Ocurrió un error al obtener el nombre de la competición");
            }

            var response = {
                'id': result,
                'nombre': result[0].nombre
            }
            res.send(JSON.stringify(response));
        });
    },
    /*carga los generos de la competencia*/
    cargarGeneros: function (req,response){
        var genero = "SELECT * FROM genero"
        con.query(genero, function (err, result, fields){
            if (err) {
                console.log("No se pudo cargar los generos de la competencia", err.message);
                return response.status(500).send(err);
            }
            response.send(JSON.stringify(result));
        });
    },

    /*carga por directores la competencia*/
    loadDirector: function (request,response){
        var director = "SELECT * FROM director"
        con.query(director, function (err, result, fields){
            if (err) {
                console.log("No se pudo cargar los directores de la competencia", err.message);
                return response.status(500).send(err);
            }
            response.send(JSON.stringify(result));
        });
    },

    /*carga por actores la competencia*/
    loadActor: function (request,response){
        var actor = "SELECT * FROM actor"
        con.query(actor, function (err, result, fields){
            if (err) {
                console.log("No se pudo cargar los actores de la competencia", err.message);
                return response.status(500).send(err);
            }
            response.send(JSON.stringify(result));
        });
    },
    deleteCompetition: function (request, response) {
        var idCompetencia = request.params.idCompetencia;
        var deletes = "DELETE FROM competencia WHERE id =" + idCompetencia;
        
        con.query(deletes, function (err, result){
            if(err){
                console.log("Error al eliminar la competicia de la base de datos", err.message);
                return response.status(500).send("Error al eliminar la competencia de la base de datos");
            }
            response.send(JSON.stringify(result));
        });
    },
    editCompetition: function (request, res) {
        /*damos las variables de los parametros*/
        var idCompetencia = request.params.id;
        var nuevoNombre = request.body.nombre;
        var editQuery = "UPDATE competencia SET nombre = '"+ nuevoNombre +"' WHERE id = "+ idCompetencia +";";
        
        con.query(editQuery,function(err, result, fields){
            if(err){
                return res.status(500).send("Ocurrio un error al editar la competencia")
            }
            if (result.length == 0){
                console.log("Ocurrio un error al editar la competencia / id invalido");
                return res.status(404).send("Ocurrio un error al editar la competencia / id invalido");
            } else {
                var response = {
                    'id': result
                };
            }
            res.send(JSON.stringify(response));
        });
    }
};
module.exports = controller;