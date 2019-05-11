const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;
const config = require('../config/config');

const data = require('../files/tmdb_data').searched;
const getonefilm = {};

// Get a film by its Id and show it on the browser
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

        let actors = [];
        let directors = [];

        if(typeof credits.cast !== 'undefined' && credits.cast.length > 0) {
            // get the first 5 actors
            let n = ((credits.cast.length > 4) ? 5 : credits.cast.length);
            for(let i = 0; i < n; i++) {
                actors.push(credits.cast[i].name);
            }
        }

        if(typeof credits.crew !== 'undefined' && credits.crew.length > 0){
            // get the director/s
            credits.crew.forEach((entry) => {
                if (entry.job === 'Director') {
                    directors.push(entry.name);
                }
            })
        }
        
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

// Get film by id from local data and execute callback function with the film infos as argument 
getonefilm.getFilmById = async(callback, id) => {
    
    // get the film
    let film = data.getFilmById(id);

    if(!film) {
        const d = new Date();
        // not a really smart way to update the searched film
        // currently solution -> no film, different date, remove all the data
        // better solution -> create a limit (for example 25/30) of saved films and a counter 
        // to see the searced times, reached the limit remove the oldest (last time searcehd) in the list or the less "popular" 
        if(data.getDate() !== d.getUTCDate()) {
            await data.clean()
        }

        // get the film from 'Imdb'
        let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_TOKEN}&language=it-IT`;
        const response = await fetch(url);
        film = await response.json();
        
        // save the film
        data.update(film);
    }
    
    let response_message = '📺  ' + film.title + '\n' + 
                        '⭐️  _voto_ : ' + film.vote_average +'\n' + 
                        '🗓  ' + film.release_date + '\n' +
                        '\n*Trama* 📝\n' +
                        '_' + film.overview + '_' ;
    // if a film exists: add a inline_keyboard to link to "more info" page
    options = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{
                            text : 'MAGGIORI INFORMAZIONI',
                            url : `${config.heroku_url}info?id=${film.id}`
                        }]] 
                }
              };
    
    callback(response_message, options);
}


module.exports = getonefilm;