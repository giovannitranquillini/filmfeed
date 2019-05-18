## FilmFeed

## Cos'è?
[FilmFeed](https://t.me/filmfeedbot) è un bot di telegram che fornisce varie informazioni sul mondo del Cinema per il panorama italiano. 
Le funzionalità principali mostrano i film in arrivo _/upcoming_, i film attualmente in sala _/nowplaying_ e permette di ricercare uno specifico film _/search_.

**FilmFeed** è scritto interamente in JavaScript con Node.js, si basa su Express.js e [telegraf.js](https://telegraf.js.org/#/), un framework per bot di Telegram.

Tutte le informazioni relative ai film sono ottenute tramite il servizio API di [TMDb](https://www.themoviedb.org/documentation/api)

<div>
    <img src="/img/nowplaying.png" width="350" title="nowplaying">
    <img src="/img/upcoming.png" width="455" title="upcoming">
</div>

## Prerequisiti

-   Su Telegraf creare un bot tramite [BotFather](https://telegram.me/botfather)
-   Fare richiesta su TMDb per una chiave API

## Usare il bot in locale

**In locale** (_da bash_):

```
    npm install
```

Usare il codice relativo al polling e non alle webhook:

```
// webhook
//app.use(bot.webhookCallback('/' + TELEGRAM_TOKEN));
//bot.telegram.setWebhook(HEROKU_APP_URL + TELEGRAM_TOKEN);

...

// polling
bot.startPolling();
```

Creare un file config-local.js: copiando la struttura di config.js, aggiungere in chiaro i dati riguardanti le chiavi per le API di telegram e TMDb, altrimenti, da bash, creare direttamente in locale le variabili d'ambiente impostando il valore delle chiavi. 

**Eseguire il bot**

```
    node index.js
```

_( per implementare nuove feature sarebbe meglio avere un secondo bot che si usa per provare i nuovi pezzi di codice )_

## Deploy del bot

Il deploy di FilmFeed è stato fatto su _Heroku_.

Per farlo dovete accertarvi di avere il **Procfile** all'interno del vostro progetto. 
Potete aggiungere direttamente su Heroku le variabili d'ambiente in _"la vostra app" > Settings > Config Vars_
_( in questo caso sarà neccessario anche salvare in URL l'url della nostra applicazione, che ci verrà fornito da heroku )_

![config vars](/img/configvars.png)

Per permettere lo scambio di informazioni fra il nostro bot e Telegram useremo delle webhook, il codice necessario è il seguente e si trova nel file app.js

```
// webhook
app.use(bot.webhookCallback('/' + TELEGRAM_TOKEN));
bot.telegram.setWebhook(HEROKU_APP_URL + TELEGRAM_TOKEN);
```

Una volta fatto il deploy su Heroku, se il package.json e il Procfile sono presenti e scritti correttamente, lo stesso Heroku si arrangerà ad eseguire il codice.

## Comandi del bot

**/nowpalying**: recupera i dati riguardanti i film in sala in questo momento, li restiutisce all'utente. Se il film è uscito da meno di 2 settimane viene aggiunto il badge 🆕.

**/upcoming**: recupera i dati riguardanti i film in arrivo, li riordina in ordine crescente di data e li restituisce tramite messaggio.

**/search**: aggiungendo del testo dopo il comando /search, è possbile cercare uno specifico film _( esempio: /search inception )_

**/chooseforme**: è un'idea da implementare in futuro, questo comando dovrebbe permettere di consigliare l'utente tramite la ricerca di un insieme di film con determinati parametri _(voto, data di rialscio, genere, ...)_



![commands](/img/commands.png)

## Altre funzionalità

Visualizzazione di una scheda descrittiva da browser sotto il path _/info_. La richiesta HTTP verrà gestita da express che caricherà un file .ejs e i dati del film. All'url viene applicata una query con attributo _id_ che dovrà contenere il valore dell'id del film.
