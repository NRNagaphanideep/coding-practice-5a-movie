const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
let database = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//get movie names api
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
SELECT
*
FROM
movie
ORDER BY
movie_id;`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});
const convertMovieDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//creating movie api
const convertDirectorDbObjectToResponseObject = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const addMovieQuery = `INSERT INTO 
movie_data(director_id,movie_name,lead_actor)
VALUES (
'${directorId}',
'${movieName}',
'${leadActor}');`;
  const movie = await db.run(addMovieQuery);
  response.send("Movie Successfully added");
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie;`;
  const moviesArray = await database.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

///get a movie id api
app.get("/movies/:movie_id/", async (request, response) => {
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
SELECT
*
FROM
movie
WHERE
movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
    SELECT 
      *
    FROM 
      movie 
    WHERE 
      movie_id = ${movieId};`;
  const movie = await database.get(getMovieQuery);
  response.send(convertMovieDbObjectToResponseObject(movie));
});

//update movie details api
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie ( director_id, movie_name, lead_actor)
  VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

app.put("/movies/:movie_id", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;
app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMoviesQuery = `
UPDATE 
movies
SET
director_id = '${directorId}',
movie_name = '${movieName}',
lead_actor = '${leadActor}'
WHERE
movie_id = '${movieId}';`;
  await db.run(updateMoviesQuery);
  const updateMovieQuery = `
            UPDATE
              movie
            SET
              director_id = ${directorId},
              movie_name = '${movieName}',
              lead_actor = '${leadActor}'
            WHERE
              movie_id = ${movieId};`;

  await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//DELETE movie api

app.delete("/movies/:moviesId/", async (request, response) => {
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deletePlayerQuery = `
DELETE FROM
movies_data
WHERE
movie_id = ${movieID};`;
  await db.run(deletePlayerQuery);
  response.send("movie Removed");
  const deleteMovieQuery = `
  DELETE FROM
    movie
  WHERE
    movie_id = ${movieId};`;
  await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//get directors list api
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
SELECT
*
FROM
director
ORDER BY
director_id;`;
  const directorsArray = await db.all(getDirectorsQuery);
  response.send(directorsArray);
    SELECT
      *
    FROM
      director;`;
  const directorsArray = await database.all(getDirectorsQuery);
  response.send(
    directorsArray.map((eachDirector) =>
      convertDirectorDbObjectToResponseObject(eachDirector)
    )
  );
});

/// get movies name in specific director api
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { movieName } = request.params;
  const getMovieNamesQuery = `
SELECT 
* 
FROM
movie
WHERE
movie_name = ${movieName};`;
  const moviesArray = await db.all(getMovieNamesQuery);
  response.send(moviesArray);
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT
      movie_name
    FROM
      movie
    WHERE
      director_id='${directorId}';`;
  const moviesArray = await database.all(getDirectorMoviesQuery);
  response.send(
    moviesArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

module.exports = app;
