# filmfeed
FilmFeed è un [bot](http://t.me/filmfeedbot) di telegram sviluppato in JavaScript con Node.js, si appoggia ai module express e Telegraf per la gestione dei comandi del bot. Il deploy del bot è stato fatto su Heroku.

Il bot usa le API messe a disposizione da TMDb per avere le informazioni sui film che vengono fornite. 

Il bot è unicamente in lingua italiana e le informazioni ricevute sono relative alla realtà italiana.

**Comandi del bot**
- /nowplaying : mostra informazioni relative a film nelle sale italiane in quel momento
- /upcoming : mostra informazioni relative ai film in uscita nelle sale italiane
- /chooseforme : permette di essere consigliati per la visione di un film qualsiasi in base a dei parametri [NOT READY] (il codice non è presente)
- /search : comando per avere informazioni su uno specifico film (il codice non è presente)
- /help : mostra la lista dei comandi
- /info : mostra le informazioni relative al bot (chi fornisce le API, chi è stato attiavamente coinvolto nella produzione) 

**Se sei interessato a utilizzare il codice sorgente** 
Nella cartella lib/config è presente il file config.js dove sono presenti le variabili globali di configurazione.
PORT : porta utilizzata dal server
TELEGRAM_TOKEN : la chiave delle API di Telegram che ti verrà fornita alla crezione del tuo bot
TMDB_TOKEN : la chiave API di TMDb
URL : l'url dell'applicazione su heroku