const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;
const URL = require('../config/config').heroku_url;
const data = require('../files/tmdb_data').upcoming;

// url to do the request and get 'upcoming' films
const url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=' + TMDB_TOKEN + '&language=it-IT&page=1&region=IT'

const upcoming = {};

upcoming.getFilms = async (callback, page) => {
    try {
        let upcoming_films;
        const d = new Date();

        if(data.getDate() === d.getUTCDate()) {
            // get films from saved data
            upcoming_films = data.getFilms();
        } else {
            // get from TMDB url
            const response = await fetch(url);
            const json = await response.json();

            upcoming_films = data.sortAndUpdate(json.results);       
        }
        
        let response_message = '*Film in arrivo*';
        let start = 0; // starting point in the array to read the films
        let length = 0; // number of films to read
        let inline_buttons = [[]];

        if(upcoming_films.length <= 10) {
            length = upcoming_films.length;
        } else {
            switch(page) {
                // first page case
                case '1' : inline_buttons = [[
                                {
                                    text: 'VEDI ALTRO ➡️',
                                    callback_data: '2,UC'
                                }
                            ]];
                            response_message += '* (1)*';
                            length = 10;
                            break;
                // second page case
                case '2' : inline_buttons = [[
                                {
                                    text: '⬅️ INDIETRO',
                                    callback_data: '1,UC'
                                }
                            ]];
                            response_message += '* (2)*';
                            start = 10;
                            length = upcoming_films.length;
                            break;
                default : break;
            }
        }

        response_message += '\n\n';
        // get the films from 'start' to 'length'
        for(let i = start; i < length; i++){
            response_message += '🎥  ' + upcoming_films[i].title + '\n' + 
            '🗓  _' + upcoming_films[i].release_date + '_' +
            ` ~ [info](${URL}info?id=` + upcoming_films[i].id +') ' + 
            '\n\n';
        }

        response_message += "\n _( per maggiori informazioni cliccare su info )_";

        // use the callback function from 'telegramMethod.js'
        callback(response_message, {
            parse_mode : 'Markdown',
            reply_markup: {
                inline_keyboard: inline_buttons
            }
        });
        
    } catch (error) {
        console.log(error);
    }
};

module.exports = upcoming;