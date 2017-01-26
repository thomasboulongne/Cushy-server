'use strict';

const Trakt = require('trakt.tv');
const api = new Trakt({
  client_id: 'bbdddc510296f9b66a944ca13e9ace64f88ecdfaaf69b794c59ef5f33884b7b1',
  client_secret: 'c7e8e7a3dcd9027424131d63e5c0f565a4f693ccdc1ff15ee2dc0bc474b22f01',
  redirect_uri: 'https://coussflix.thomasboulongne.com',   // fallbacks to 'urn:ietf:wg:oauth:2.0:oob'
  api_url: null         // fallbacks to 'api-v2launch.trakt.tv'
});

const MovieDB = require('moviedb')('99b804bdceeb4b618428eec89c04412e');

class MovieManager {

    constructor() {
    }

    getMood() {
        /* INSERT DATA ANALYSIS BULLSHIT HERE */

        return [
            "Disappointed",
            "Sad"
        ];
    }

    getGenres() {
        /* INSERT MOOD MAPPING BULLSHIT HERE */

        return [
            "thriller"
        ];
    }

    getMovies(data) {
        const mood = this.getMood(data);
        const genres = this.getGenres(mood);

        return new Promise( (resolve, reject) => {
            api.movies.popular({
                genres: genres.toString(),
                extended: 'full',
                page: 1,
                limit: 5
            }).then(response => {
                let result = {};
                result.genres = genres;
                result.movies = response;

                let promises = [];

                for (let i = 0; i < result.movies.length; i++) {
                    let movie = result.movies[i];
                    let customRating = Math.round(movie.rating / 2);
                    movie.customRating = [];
                    console.log(movie);
                    for (let j = 0; j < 5; j++) {
                        if(customRating > j) {
                            movie.customRating.push('🌝');
                        }
                        else {
                            movie.customRating.push('🌚');
                        }
                    }

                    promises.push(new Promise( resolveBackdrop => {
                        MovieDB.movieInfo({id: movie.ids.tmdb}, (err, res) => {
                            movie.backdropImage = 'https://image.tmdb.org/t/p/w1300_and_h730_bestv2' + res.backdrop_path;
                            resolveBackdrop('success');
                        });
                    }));
                }

                Promise.all(promises)
                .then(() => {
                    resolve(result);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

};

let mm = new MovieManager();
module.exports = mm;