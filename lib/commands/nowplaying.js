const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;
const URL = require('../config/config').heroku_url;
const data = require('../files/tmdb_data').nowplaying;

// url to do the request and get 'nowplaying' films
const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + TMDB_TOKEN + '&language=it-IT&page=1&region=IT';

const nowplaying = {};

nowplaying.getFilms = async (callback, page) => {
    try {
        let nowplaying_films;
        const d = new Date();

        if(data.getDate() === d.getUTCDate()) {
            // get films from saved data
            nowplaying_films = data.getFilms();
        } else {
            // get from TMDB url
            const response = await fetch(url);
            const json = await response.json();
            nowplaying_films = json.results;
            data.update(json.results);
        }

        let response_message = '*Principali film nelle sale italiane*';
        let start = 0; // starting point in the array to read the films
        let length = 0; // number of films to read
        let inline_buttons = [[]];

        if(nowplaying_films.length <= 10) {
            length = nowplaying_films.length;
        } else {
            switch(page) {
                // first page case
                case '1' : inline_buttons = [[
                                {
                                    text: 'VEDI ALTRO ➡️',
                                    callback_data: '2,NP'
                                }
                            ]];
                            response_message += '* (1)*';
                            length = 10;
                            break;
                // second page case
                case '2' : inline_buttons = [[
                                {
                                    text: '⬅️ INDIETRO',
                                    callback_data: '1,NP'
                                }
                            ]];
                            response_message += '* (2)*';
                            start = 10;
                            length = nowplaying_films.length;
                            break;
                default : break;
            }
        }

        response_message += '\n\n';

        // get the films from 'start' to 'length
        for(let i = start; i < length; i++){

            response_message += '🎬  ' + nowplaying_films[i].title +
            '\n' +
            '⭐  ' + nowplaying_films[i].vote_average + 
            ` ~ [info](${URL}info?id=` + nowplaying_films[i].id +') ' + 
            isNew(nowplaying_films[i].release_date) + '\n' +
            '\n';
        }

        // use the callback function from 'telegramMethod.js'
        callback(response_message, {
            parse_mode : 'Markdown',
            reply_markup: {
                inline_keyboard: inline_buttons
            },
            disable_web_page_preview : true
        });

    } catch (error) {
        console.log(error);
    }
};

// if a film has been released for less than a week, acquire the 'new' badge
function isNew (release_date) {

    // if the format of the day is '0x' and we sum to it a number n, it returns '0xn'
    let release_day = ((release_date.split('-'))[2]);
    if((release_day)[0] == '0') {
        release_day = (release_day)[1];
    } 

    let release_month = ((release_date.split('-'))[1]);
    if((release_month)[0] == '0') {
        release_month = (release_month)[1];
    } 

    // 2 weeks more than the day of release
    release_day = Number(release_day) + 15;
    // The months starts with 0 in JavaScript and the Imdb api instead pass it starting from 1 
    release_month = Number(release_month) - 1;

    // create a date that must be 2 weeks after the release
    let after_a_week_release = new Date((release_date.split('-'))[0],release_month, release_day);
    
    // create a date for today
    let today = new Date();

    let isnew = '';

    // if today it is less than a week that the film has been released
    if(after_a_week_release > today) {
        isnew = '~ 🆕';
    }   

    return isnew;
}

module.exports = nowplaying;