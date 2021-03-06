const Telegraf = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/config');
const { send, update, answerInlineQuery } = require('./telegram/telegramMethods');
const Telegram = require('telegraf/telegram')

const mongoose = require('mongoose');
const query = require('../lib/db/query');

const app = express();
// Using 'ejs' for client side and setting the 'view engine' for this language 
app.set('view engine', 'ejs');
app.set('views',  __dirname + '/views');
app.use(bodyParser.urlencoded({ extended : true}));

const db_user = config.db_username;
const db_password = config.db_password;
const url = `mongodb://${db_user}:${db_password}@ds046677.mlab.com:46677/filmfeed`;

// Connection to the DB (mongodb)
mongoose.connect( 
    url, 
    { 
        useCreateIndex: true,
        useNewUrlParser: true 
    }
);

const PORT = config.port;
const URL = config.heroku_url;
const TOKEN = config.telegram_token;

const nowplaying = require('./commands/nowplaying');
const upcoming = require('./commands/upcoming');
const search = require('./commands/search');
const getonefilm = require('./commands/getonefilm');
const getFilmsByTitle = require('./commands/getfilms');

const data = require('./files/tmdb_data').list;

// set the bot username, this way it's work also in group chats 
const bot = new Telegraf(TOKEN, {username: 'filmfeedbot'}); 
const telegram = new Telegram(TOKEN);

// set webhook
app.use(bot.webhookCallback('/' + TOKEN));
bot.telegram.setWebhook(URL + TOKEN);

// BOT COMMANDS

// get nowplaying films
bot.command('/nowplaying', async (ctx) => {  
    const idUser = ctx.update.message.from.id;
    data.findByUserIdAndRemove(idUser);

    const id = ctx.update.message.chat.id;
    let callback = send.bind(null, id);
    await nowplaying.getFilms(callback, '1'); 

    // record the last use of a User
    const telegram_user = ctx.update.message.from;
    if(!telegram_user.is_bot){
        query.log({   
            telegram_id: telegram_user.id, 
            username: telegram_user.username, 
            last_use: new Date()
        });
    }
});

// get upcoming films
bot.command('/upcoming', async (ctx) => {
    const idUser = ctx.update.message.from.id;
    data.findByUserIdAndRemove(idUser);

    const id = ctx.update.message.chat.id;
    let callback = send.bind(null, id);
    await upcoming.getFilms(callback, '1');

    // record the last use of a User
    const telegram_user = ctx.update.message.from;
    if(!telegram_user.is_bot){
        query.log({   
            telegram_id: telegram_user.id, 
            username: telegram_user.username, 
            last_use: new Date()
        });
    }
});

// reccomend a film
bot.command('/chooseforme', (ctx) => {
    const id = ctx.update.message.chat.id;
    const message = 'not ready';
    send(id, message, null);
});

// search a film by name
bot.command('/search', (ctx) => {
    const idUser = ctx.update.message.from.id;
    data.add(idUser, 'SEARCH');

    const id = ctx.update.message.chat.id;
    const message = '*Inserisci il nome del film che vuoi cercare...* 🔎 ⬇️';
    send(id, message, {parse_mode : 'Markdown'});
});

// get info on the bot
bot.command('/info', (ctx) => {
    const id = ctx.update.message.chat.id;
    (query.getUserNumber()).then((users) => {
        if(users) {
            const message = 'Le informazioni sui film sono fornite da [TMDb](https://www.themoviedb.org) 💾\n' +
                    'Il codice del bot potrebbe essere rilasciato in futuro su [github](https://github.com/giovannitranquillini/)\n' +
                    'FilmFeed è stato sviluppato da @giobbecravatta 💻\n\n' +
                    '_Ti piace il bot_, ma hai dei *consigli* per migliorarlo? Sono aperto ad ogni tipo di _suggerimento_ 🤗\n\n' +
                    'Si ringrazia *Martina Aste* per il _logo del bot_ \n\n' +
                    `Il bot è stato usato da _${users.length}_ persone 👥`;
            send(id, message, {parse_mode : 'Markdown'});
        }
    });   
});

// manage a particular case: to see nowplaying or upcoming second page
bot.on('callback_query', async (callbackQuery) => {
    const c_query = callbackQuery.update.callback_query;

    let data = (c_query.data).split(',');
    const page = data[0];
    const method = data[1];
    let chat_id =  c_query.message.chat.id;
    let message_id = c_query.message.message_id;

    // call a method to update an existing message
    let callback = update.bind(null, chat_id, message_id);
    
    // NP = nowpalying
    // UC = upcoming
    // NP/UC + I = info
    // FILM = return a film by its Id
    switch(method) {
        case 'NP':
            await nowplaying.getFilms(callback, page);
            break;
        case 'UC':
            await upcoming.getFilms(callback, page);
            break;
        case 'NPI':
            await nowplaying.getFilmsDetails(callback, page);
            break;
        case 'UCI':
            await upcoming.getFilmsDetails(callback, page);
            break;
        case 'FILM':
            // in 'page' in this case we put the film id
            await getonefilm.getFilmById(callback, page);
            break;
        default:
          console.log('error, no callback query found');
    }

    // record the last use of a User
    const telegram_user = c_query.from;
    if(!telegram_user.is_bot){
        query.log({   
            telegram_id: telegram_user.id, 
            username: telegram_user.username, 
            last_use: new Date()
        });
    }
});

bot.on('inline_query', ctx => {
    // title to search
    let title = ctx.update.inline_query.query;
    const id = ctx.update.inline_query.id;
    let callback = answerInlineQuery.bind(null, id);
    
    getFilmsByTitle(title, callback).catch(error => {console.log("Promise error: " + error)}); 
});

// start command
bot.start((ctx) => {
    const id = ctx.update.message.chat.id;
    const message = '*Ciao! Questo è FilmFeed.*\n' +
                    'Con questo bot finalmente saprai sempre quali film ci sono al cinema e quali sono in arrivo!\n\n' +
                    '⚠️ *Usa* /help *per accedere alla lista dei comandi* ⚠️';
    send(id, message, {parse_mode : 'Markdown'});
});

// help command
bot.help(ctx => {
    const id = ctx.update.message.chat.id;
    const message ='*Lasciati aiutare da FilmFeed!* 👀 \n\n' +
                    'Usa /nowplaying per tenerti aggiornato sui film in sala. 🎬 \n\n' +  
                    'Usa /upcoming per scoprire i film in arrivo. 🎥\n\n' +
                    'Usa /search per avere maggiori informazioni su un film. 🔍\n\n' +
                    'Digita @filmfeedbot per trovare una lista di film in base al titolo\n\n' +
                    'Usa /info per altre informazioni sul bot';
    send(id, message, {parse_mode : 'Markdown'});
});

// control on user text messages
bot.on('text', (ctx) => {
    const idUser = ctx.update.message.from.id;

    // if user is in the list, it returns true 
    // and search for a film
    if(data.findByUserIdAndRemove(idUser)){
        const idMessage = ctx.update.message.chat.id;
        const message = ctx.update.message.text;
        search.getFilms(idMessage, message);
    }
});

bot.catch( err => {
    console.log('errore: ' + err);
});

// to execute locally
// bot.startPolling();

// server express
app.get('/', (req, res) => {
    res.send('Hello World! This is FilmFeed');
});

// see more information about a single film
app.get('/info', getonefilm.getFilm);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} ...`);
});