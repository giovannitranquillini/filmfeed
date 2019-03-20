const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;

const getonefilm = {};

// Get a film by its Id
getonefilm.getFilm = async (req, res, next) => {
    
    let film_id = req.query.id;

    if(film_id) {
        // get the film from 'Imdb'
        let url = `https://api.themoviedb.org/3/movie/${film_id}?api_key=${TMDB_TOKEN}&language=it-IT`;
        const response = await fetch(url);
        const film = await response.json();

        // get the cast and the crew of a film
        let cast_url = `https://api.themoviedb.org/3/movie/${film_id}/credits?api_key=${TMDB_TOKEN}`;
        const response_c = await fetch(cast_url);
        const credits = await response_c.json();

        // get the first 5 actors
        let actors = [];
        for(let i = 0; i < 5; i++) {
            actors.push(credits.cast[i].name);
        }

        // get the director/s
        let directors = [];
        credits.crew.forEach((entry) => {
            if (entry.job === 'Director') {
                directors.push(entry.name);
            }
        })

        if(film) {
            res.render('filminfo', {film: film, actors: actors, directors: directors});
        }
        else {
            res.status(404);
        }
    } else {
        res.status(404);
    }
}


module.exports = getonefilm;