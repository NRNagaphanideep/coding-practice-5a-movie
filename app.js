const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
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

//creating movie api

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
});

///get a movie id api
app.get("/movies/:movie_id/", async (request, response) => {
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
});

//update movie details api

app.put("/movies/:movie_id", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;
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
  response.send("Movie Details Updated");
});

//DELETE movie api

app.delete("/movies/:moviesId/", async (request, response) => {
  const { movieId } = request.params;
  const deletePlayerQuery = `
DELETE FROM
movies_data
WHERE
movie_id = ${movieID};`;
  await db.run(deletePlayerQuery);
  response.send("movie Removed");
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
});

module.exports = app;
