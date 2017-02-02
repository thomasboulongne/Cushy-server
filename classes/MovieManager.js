'use strict';

const Trakt = require('trakt.tv');
const api = new Trakt({
  client_id: 'bbdddc510296f9b66a944ca13e9ace64f88ecdfaaf69b794c59ef5f33884b7b1',
  client_secret: 'c7e8e7a3dcd9027424131d63e5c0f565a4f693ccdc1ff15ee2dc0bc474b22f01',
  redirect_uri: 'https://coussflix.thomasboulongne.com',   // fallbacks to 'urn:ietf:wg:oauth:2.0:oob'
  api_url: null         // fallbacks to 'api-v2launch.trakt.tv'
});

const MovieDB = require('moviedb')('99b804bdceeb4b618428eec89c04412e');
const _ = require('lodash');

class MovieManager {

    constructor() {
    }

    getMood() {
        /* INSERT DATA ANALYSIS BULLSHIT HERE */

        return {
            title: "Feeling droopy?",
            subtitle: "Let's have a laugh!"
        };
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
            let promises = [];
            let result = {};
            result.genres = genres;
            result.mood = mood;
            promises.push(
                api.movies.popular({
                genres: genres.toString(),
                extended: 'full',
                page: 1,
                limit: 5
            }));

            promises.push(
                api.shows.popular({
                genres: genres.toString(),
                extended: 'full',
                page: 1,
                limit: 5
            }));

            Promise.all(promises)
            .then( responses => {
                result.movies = responses[0];
                result.shows = responses[1];

                let subPromises = [];

                for (let i = 0; i < result.movies.length; i++) {
                    let movie = result.movies[i];
                    let customRating = Math.round(movie.rating / 2);
                    movie.customRating = [];
                    for (let j = 0; j < 5; j++) {
                        if(customRating > j) {
                            movie.customRating.push('starred');
                        }
                        else {
                            movie.customRating.push('');
                        }
                    }

                    movie.hours = Math.floor(movie.runtime / 60);
                    movie.minutes = '0' + movie.runtime % 60;
                    movie.minutes = movie.minutes.substr(-2, 2);

                    if(movie.trailer)
                        movie.trailerId = movie.trailer.split('=')[1];

                    subPromises.push(new Promise( resolveBackdrop => {
                        MovieDB.movieInfo({id: movie.ids.tmdb}, (err, res) => {
                            movie.backdropImage = 'https://image.tmdb.org/t/p/w370_and_h556_bestv2' + res.poster_path;
                            MovieDB.movieCredits({id: movie.ids.tmdb}, (err, res) => {
                                movie.director = _.find(res.crew, o => {
                                    return o.job == 'Director';
                                });
                                
                                movie.cast = _.take(res.cast, 3);
                                resolveBackdrop('success');
                            });
                        });
                    }));
                }

                for (let i = 0; i < result.shows.length; i++) {
                    let show = result.shows[i];
                    let customRating = Math.round(show.rating / 2);
                    show.customRating = [];

                    for (let j = 0; j < 5; j++) {
                        if(customRating > j) {
                            show.customRating.push('starred');
                        }
                        else {
                            show.customRating.push('');
                        }
                    }

                    show.hours = Math.floor(show.runtime / 60);
                    show.minutes = '0' + show.runtime % 60;
                    show.minutes = show.minutes.substr(-2, 2);

                    if(show.trailer)
                        show.trailerId = show.trailer.split('=')[1];

                    subPromises.push(new Promise( resolveBackdrop => {
                        MovieDB.tvInfo({id: show.ids.tmdb}, (err, res) => {
                            show.backdropImage = 'https://image.tmdb.org/t/p/w370_and_h556_bestv2' + res.poster_path;
                            MovieDB.tvCredits({id: show.ids.tmdb}, (err, res) => {
                                show.cast = _.take(res.cast, 3);
                                resolveBackdrop('success');
                            });
                        });
                    }));
                }

                Promise.all(subPromises)
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