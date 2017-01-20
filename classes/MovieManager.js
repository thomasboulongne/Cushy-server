const Trakt = require('trakt.tv');
const api = new Trakt({
  client_id: 'bbdddc510296f9b66a944ca13e9ace64f88ecdfaaf69b794c59ef5f33884b7b1',
  client_secret: 'c7e8e7a3dcd9027424131d63e5c0f565a4f693ccdc1ff15ee2dc0bc474b22f01',
  redirect_uri: 'https://coussflix.thomasboulongne.com',   // fallbacks to 'urn:ietf:wg:oauth:2.0:oob'
  api_url: 'https://coussflix.thomasboulongne.com'         // fallbacks to 'api-v2launch.trakt.tv'
});

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
            "Action",
            "Comedy"
        ];
    }

    getMovies(data) {
        const mood = this.getMood(data);
        const genres = this.getGenres(mood);

        console.log('Selected genres:', genres);

        api.search.text({
            query: 'tron',
            type: 'movie,person'
        }).then(response => {
            console.log(response);
        });
        return true;
    }

};

let mm = new MovieManager();
module.exports = mm;