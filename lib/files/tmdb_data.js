// We use a structure to save the first request of the day locally
// for 'nowplaying' and 'upcoming' commands.
// This way, we can do less request to TMDB
// update: add a new collection searched to save last visualized films
let data = {
    nowplaying : {},
    upcoming : {},
    searched : {
        films : []
    }
};

const nowplaying = {
    // save the data
    update(nowplayings) {
        let today = new Date();
        data.nowplaying.n = today.getUTCDate()
        data.nowplaying.films = nowplayings;
    },

    // get the last saved day
    getDate() {
        return data.nowplaying.n;
    },

    // get the data saved
    getFilms() {
        return data.nowplaying.films;
    }
};

const upcoming = {
    // save the data
    update(upcomings) {
        let today = new Date();
        data.upcoming.n = today.getUTCDate()
        data.upcoming.films = upcomings;
    },

    // get the last saved day
    getDate() {
        return data.upcoming.n;
    },

    // get the data
    getFilms() {
        return data.upcoming.films;
    },

    // sort the data for 'release_date' and save
    sortAndUpdate (unsorted_films) {

        let tmp, indice_minimo;

        // SelectionSort
        for(let i = 0; i < unsorted_films.length - 1; i++){
            indice_minimo = i;
            for(let j = i+1; j < unsorted_films.length; j++){
                // first date > second date => true
                if(compareDate(unsorted_films[indice_minimo], unsorted_films[j])){
                    indice_minimo = j;
                }
            }

            tmp = unsorted_films[indice_minimo];
            unsorted_films[indice_minimo] = unsorted_films[i];
            unsorted_films[i] = tmp;
        }

        let today = new Date();
        data.upcoming.n = today.getUTCDate()
        data.upcoming.films = unsorted_films;

        return unsorted_films;
    }
};

const searched = {
    // update with a new searched film
    update(searched_film) {
        data.searched.films.push(searched_film);
    },

    // remove all the object in searched.films and update date
    clean() {
        let today = new Date();
        data.searched.n = today.getUTCDate();
        data.searched.films = [];
    },

    // get the last saved day
    getDate() {
        return data.searched.n;
    },

    // get the data
    getFilms() {
        return data.upcoming.films;
    },

    getFilmById(id) {
        // search a film by id, if exists return it, otherwise return null
        let found = (data.searched.films).find(film => film.id === id);
        if(found){
            return found;
        } else {
            return null;
        }
    }

}

// Given two films confront the release dates [year-month-day] 
// RETURN TRUE if the first (date1) is grater or equal of the second (date2)
// and for same dates if the popularity of the first film is grater or equal of the second one
function compareDate(film1, film2) {
    
    let splitted_date_1 = film1.release_date.split('-');
    let splitted_date_2 = film2.release_date.split('-');
    
    // if date(1) and date(2) are equal
    if(splitted_date_1[0] == splitted_date_2[0] && splitted_date_1[1] == splitted_date_2[1] && splitted_date_1[2] == splitted_date_2[2]) {
        if(film1.popularity <= film2.popularity) {
            return true;
        }
        return false;
    }

    // confront year(1) > year(2)
    if(Number(splitted_date_1[0]) > Number(splitted_date_2[0])) {
        return true;
    } else {
        // confront year(1) < year(2)
        if(Number(splitted_date_1[0]) < Number(splitted_date_2[0])) {
            return false;
        } else {
            // confront month(1) > month(2)
            if(Number(splitted_date_1[1]) > Number(splitted_date_2[1])) {
                return true;
            } else {
                // confront month(1) < month(2)
                if(Number(splitted_date_1[1]) < Number(splitted_date_2[1])) {
                    return false;
                } else {
                    // confront day(1) > day(2)
                    if(Number(splitted_date_1[2]) > Number(splitted_date_2[2])) {   
                        return true;
                    }
                    return false;
                }
            }  
        } 
    }
}

module.exports = {
    nowplaying,
    upcoming,
    searched
}