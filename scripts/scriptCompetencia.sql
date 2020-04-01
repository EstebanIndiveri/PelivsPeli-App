/*PASO 2*/
USE competencias;
DROP TABLE IF EXISTS competencia;

CREATE TABLE competencia (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);
/*CREAMOS LA INSTANCIA DE VOTO */
USE competencias;
DROP TABLE IF EXISTS voto;

CREATE TABLE voto (
  id INT NOT NULL AUTO_INCREMENT,
  pelicula_id int(11) unsigned NOT NULL,
  competencia_id INT NOT NULL,
  PRIMARY KEY (id)
);
/*se moficican las tablas y se agrega la FOREIGN KEY*/
ALTER TABLE voto add FOREIGN KEY (pelicula_id) REFERENCES pelicula(id);

ALTER TABLE voto add FOREIGN KEY (competencia_id) REFERENCES competencia(id);
ALTER TABLE competencia ADD COLUMN genero_id INT (11) UNSIGNED, ADD FOREIGN KEY (genero_id) REFERENCES genero(id);
ALTER TABLE competencia ADD COLUMN director_id INT (11) UNSIGNED, ADD FOREIGN KEY (director_id) REFERENCES director(id);

ALTER TABLE competencia ADD COLUMN actor_id INT (11) UNSIGNED, ADD FOREIGN KEY (actor_id) REFERENCES actor(id);
/*PASO 3*/
INSERT INTO competencia (nombre) VALUES ('¿Cuál es la mejor película?'), ('¿Qué drama te hizo llorar más?'), ('¿Cuál es la peli más bizarra?'), ('¿Con qué comedia te reíste más?'), ('¿Cuál película es mejor para un día de nublado?'), ('¿Qué pelicula de terror fue el más te asustó?'), ('¿Cuál es la mejor pelicula de acción?');



 

