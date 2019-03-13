const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;

const getonefilm = {};

// Get a film by its Id
getonefilm.getFilm = async (req, res, next) => {
    
    let film_id = req.query.id;

    if(film_id) {
        // get the film from 'Imdb'
        let url = "https://api.themoviedb.org/3/movie/" + film_id + "?api_key=" + TMDB_TOKEN + "&language=it-IT";
        const response = await fetch(url);
        const film = await response.json();

        if(film) {
            res.render('filminfo', {film : film});
        }
        else {
            res.status(404);
        }
    } else {
        res.status(404);
    }
}


module.exports = getonefilm;