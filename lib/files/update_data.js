const fetch = require('node-fetch');
const TMDB_TOKEN = require('../config/config').tmdb_token;
const URL = require('../config/config').heroku_url;
const data = require('../files/tmdb_data');


// url to do the request and get 'nowplaying' films
const nowplaying_query_url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + TMDB_TOKEN + '&language=it-IT&page=1&region=IT';
// url to do the request and get 'upcoming' films
const upcoming_query_url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=' + TMDB_TOKEN + '&language=it-IT&page=1&region=IT'

const update_data = {};

// do a requesto to TMDb and get updated nowplaying films
update_data.update_nowplaying_films = async () => {
    const response = await fetch(nowplaying_query_url);
    const json = await response.json();
    nowplaying_films = json.results;
    data.nowplaying.update(json.results);
}

// do a requesto to TMDb and get updated upcoming films
update_data.update_upcoming_films = async () => {
    const response = await fetch(upcoming_query_url);
    const json = await response.json();
    upcoming_films = json.results;
    data.upcoming.update(json.results);
}

module.exports = update_data;



