const data = require('../files/tmdb_data').upcoming;
const update = require('../files/update_data').update_upcoming_films;

const upcoming = {};

upcoming.getFilms = async (callback, page) => {
    try {
        
        const d = new Date();

        if(data.getDate() !== d.getUTCDate()) {
            // get films from saved data
            await update();
        }

        let upcoming_films = data.getFilms();
        
        let response_message = '*Film in arrivo*';
        let start = 0; // starting point in the array to read the films
        let length = 0; // number of films to read
        let inline_buttons = [[]];

        if(upcoming_films.length <= 10) {
            length = upcoming_films.length;
            inline_buttons = [
                [{
                    text: 'DETTAGLI FILM',
                    callback_data: '1,UCI'
                }]
            ] 
        } else {
            switch(page) {
                // first page case
                case '1' : inline_buttons = [
                                [{
                                    text: '➡️',
                                    callback_data: '2,UC'
                                }],
                                [{
                                    text: 'DETTAGLI FILM',
                                    callback_data: '1,UCI'
                                }]
                            ];
                            response_message += '* (1)*';
                            length = 10;
                            break;
                // second page case
                case '2' : inline_buttons = [
                                [{
                                    text: '⬅️',
                                    callback_data: '1,UC'
                                }],
                                [{
                                    text: 'DETTAGLI FILM',
                                    callback_data: '2,UCI'
                                }]
                            ];
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
            '🗓  _' + upcoming_films[i].release_date + '_\n\n';
        }

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

upcoming.getFilmsDetails = async (callback, page) => {
    try {
        
        const d = new Date();

        if(data.getDate() !== d.getUTCDate()) {
            await update()
        }

        let upcoming_films = data.getFilms();
        let inline_buttons = [];

        switch(page) {
            // first page case
            case '1' : 
                    for(let i = 0; (i < upcoming_films.length) && (i < 10); i++) {
                        inline_buttons.push([{
                            text: upcoming_films[i].title,
                            callback_data: upcoming_films[i].id + ',FILM'
                        }])
                    }
                    break;
            // second page case
            case '2' :
                    for(let i = 10; (i < upcoming_films.length); i++) {
                        inline_buttons.push([{
                            text: upcoming_films[i].title,
                            callback_data: upcoming_films[i].id + ',FILM'
                        }])
                    }
                    break;
            default : break;
        }

        inline_buttons.push([{
            text: '⬅️ TITOLI',
            callback_data: page + ',UC'
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

module.exports = upcoming;