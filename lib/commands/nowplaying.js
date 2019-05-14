const data = require('../files/tmdb_data').nowplaying;
const update = require('../files/update_data').update_nowplaying_films;

const nowplaying = {};

nowplaying.getFilms = async (callback, page) => {
    try {
        const d = new Date();

        if(data.getDate() !== d.getUTCDate()) {
            await update()
        }

        // get films from saved data
        let nowplaying_films = data.getFilms();

        let response_message = '* Principali film nelle sale italiane*';
        let start = 0; // starting point in the array to read the films
        let length = 0; // number of films to read
        let inline_buttons = [[]];
        
        if(nowplaying_films.length <= 10) {
            length = nowplaying_films.length;
            inline_buttons = [
                [{
                    text: '🔄',
                    callback_data: '1,NP'
                }],
                [{
                    text: 'DETTAGLI FILM',
                    callback_data: '1,NPI'
                }]
            ] 
        } else {
            switch(page) {
                // first page case
                case '1' : inline_buttons = [
                                [{
                                    text: '➡️',
                                    callback_data: '2,NP'
                                },
                                {
                                    text: '🔄',
                                    callback_data: '1,NP'
                                }],
                                [{
                                    text: 'DETTAGLI FILM',
                                    callback_data: '1,NPI'
                                }]
                            ];
                            response_message += '* (1)*';
                            length = 10;
                            break;
                // second page case
                case '2' : inline_buttons = [
                                [{
                                    text: '⬅️',
                                    callback_data: '1,NP'
                                },
                                {
                                    text: '🔄',
                                    callback_data: '2,NP'
                                }],
                                [{
                                    text: 'DETTAGLI FILM',
                                    callback_data: '2,NPI'
                                }]
                            ];
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

            response_message += '🎬  ' + nowplaying_films[i].title + isNew(nowplaying_films[i].release_date) + '\n' +
            '⭐  _voto : _' + nowplaying_films[i].vote_average + 
            '\n\n';
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

// return a object of inline-keyboard of each param *page* film titles
nowplaying.getFilmsDetails = async (callback, page) => {
    try {
        
        const d = new Date();

        if(data.getDate() !== d.getUTCDate()) {
            await update()
        }

        let nowplaying_films = data.getFilms();
        let inline_buttons = [];

        switch(page) {
            // first page case
            case '1' : 
                    for(let i = 0; (i < nowplaying_films.length) && (i < 10); i++) {
                        inline_buttons.push([{
                            text: nowplaying_films[i].title,
                            callback_data: nowplaying_films[i].id + ',FILM'
                        }])
                    }
                    break;
            // second page case
            case '2' :
                    for(let i = 10; (i < nowplaying_films.length); i++) {
                        inline_buttons.push([{
                            text: nowplaying_films[i].title,
                            callback_data: nowplaying_films[i].id + ',FILM'
                        }])
                    }
                    break;
            default : break;
        }

        inline_buttons.push([{
            text: '⬅️ TITOLI',
            callback_data: page + ',NP'
        }]);

        callback('*Premi sul film per vedere la sua scheda*', {
            parse_mode : 'Markdown',
            reply_markup: {
                inline_keyboard: inline_buttons
            }
        });

    } catch (error) {
        console.log(error);
    }
}

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
        isnew = '  🆕';
    }   

    return isnew;
}

module.exports = nowplaying;