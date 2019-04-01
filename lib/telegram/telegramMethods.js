const TELEGRAM_TOKEN = require('../config/config').telegram_token;

const Telegram = require('telegraf/telegram');
const telegram = new Telegram(TELEGRAM_TOKEN);

// Send message to a specific chat (private or group) 
function send (id, message, options) {   
    telegram.sendMessage(id, message, options).then((res) => {
    }).catch((err) => {
        console.log('ERROR: ' + err);
    });
}

// Update existing message in a chat with new text
function update (chat_id, message_id, updated_text, options) {  
    telegram.editMessageText(chat_id, message_id, null, updated_text, options).catch((err) => {
        console.log('ERROR: ' + err);
    });
}

function answerInlineQuery(inline_query_id, data) {
    telegram.answerInlineQuery(inline_query_id, data).catch((err) => {
        console.log('ERROR:' + err);
    });
};

module.exports = { 
    send,
    update,
    answerInlineQuery
};