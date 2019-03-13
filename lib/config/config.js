// config information
const config = {
    telegram_token : process.env.TELEGRAM_TOKEN, // here goes telegram API token
    tmdb_token : process.env.TMDB_TOKEN, // here goes TMDB API token
    port : process.env.PORT || 3000, 
    heroku_url : process.env.URL, // url of the heroku app, needed to set webhook
    db_username : process.env.DB_USERNAME,
    db_password : process.env.DB_PASSWORD,
}

module.exports = config;