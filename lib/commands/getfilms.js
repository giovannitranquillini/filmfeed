const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;
const URL = require('../config/config').heroku_url;

const getFilmsByTitle = async (title, ctx) => {
    
    const url = 'https://api.themoviedb.org/3/search/movie?api_key=' + TMDB_TOKEN + '&language=it-IT&query=' + title + '&page=1&include_adult=false';

    // get from TMDb one film based on a title
    const response = await fetch(url);
    const json = await response.json();
    const searched_film = json.results; 

    if(searched_film) {
        // if found films are less than 5 take that number, otherwise 5
        let length = (searched_film.length < 5) ? searched_film.length : 5;

        // get some info from films
        let films = [];
        for(let i = 0; i < length; i++) {
            films[i] = formatted_film(searched_film[i],i);
        }

        ctx.answerInlineQuery(films);
    }
}

function formatted_film(film, id) {
    
    const message = {
        message_text : ' ', // body of the response message
        parse_mode : 'Markdown'
    }

    // if overview exist then description get the frist 40 chars of it or an empty string
    const description = (film.overview != '' || film.overview) ? `${(film.overview).substring(0,80)} ...` : '';

    if((film.overview != '' || film.overview)) {
        message.message_text = `*${film.title}* \n` + 
                               `⭐ _${film.vote_average}_\n` +
                               `🗓 _${film.release_date}_\n\n` +
                               `*Descrizione* 📝\n_${film.overview}_\n\n` +
                               `[MAGGIORI INFORMAZIONI](${URL}info?id=${film.id})` 
    } else {
        message.message_text = 'nessuna trama trovata'
    }

    // to do : if the film doen't have a poster image, use the filmfeed icon as thumbnail
    return {
        type : 'article',
        id : id,
        title : film.title,
        input_message_content : message,
        description: description,
        thumb_url : `https://image.tmdb.org/t/p/w400${film.poster_path}`
    }

}

module.exports = getFilmsByTitle;