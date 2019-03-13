const fetch = require('node-fetch');
const config = require('../config/config');
const send = require('../telegram/telegramMethods').send;

const search = {};

search.getFilms = async (id, title) => {
    try {
        let response_message = '*Film trovato*\n\n';
        let options = {parse_mode : 'Markdown'};
        
        if(!title) {
            // no title
            response_message += '_Nessun titolo inserito_\n\n' + 
                                'Scrivi "*/search titolo*" per trovare un film\n' +
                                '(esempio: _/search inception_)';    
        } else {
            //title exists

            // url to do the request and get a film by his name
            const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + config.tmdb_token + '&language=it-IT&query=' + title + '&page=1&include_adult=false';
            
            // get from TMDb one film based on a title
            const response = await fetch(url);
            const json = await response.json();
            const searched_film = json.results;           

            // get the first film found (it should be the most popular)
            if(searched_film[0]) {
                response_message += '📺  ' + searched_film[0].title + '\n' + 
                                '⭐️  _voto_ : ' + searched_film[0].vote_average +'\n' + 
                                '🗓  ' + searched_film[0].release_date + '\n' +
                                '\n\n' +
                                '_' + searched_film[0].overview + '_' ;
            } else {
                // no film found 
                response_message += '_Nessun film trovato con questo titolo._';
            }
        }

        // use send method of 'telegramMethod.js'
        send(id, response_message, options);

    } catch (error) {
        console.log(error);
    }
};

module.exports = search;