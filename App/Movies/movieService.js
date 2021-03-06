
actorApp.factory("movieService", function ($http, $log, $q, $timeout, min2HourStr) {

    var API_KEY = "bce8cf411be52423d49e88adaa634d4a";

    function Movie(name, tmdbID, length, actors, director, poster, imdbUrl, description) {
        this.name = name;
        this.tmdbID = tmdbID;
        this.length = min2HourStr.convMin2HourStr(length); //toString();
        this.actors = actors
        this.director = director;
        this.imgUrl = "https://image.tmdb.org/t/p/w200/" + poster;
        this.imdbUrl = "https://www.imdb.com/title/" + imdbUrl;
        this.text = description;
    }

    var moviesArr = [];

    function addMovie(id) {

        var theUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +
            API_KEY + "&append_to_response=credits";
        var async = $q.defer();

        $http.get(theUrl).then(function (response) {
            var actors = [];
            var director = "";
            var actorNum = (response.data.credits.cast.length > 5) ? 5 : response.data.credits.cast.length;

            for (var i = 0; i < actorNum; i++) {
                actors.push(response.data.credits.cast[i].name);
            }

            for (var i = 0; i < response.data.credits.crew.length; i++) {
                if (response.data.credits.crew[i].job === "Director")
                    director = response.data.credits.crew[i].name;
            }

            var aMovie = new Movie(response.data.title,
                response.data.id,
                response.data.runtime,
                actors,
                director,
                response.data.poster_path,
                response.data.imdb_id,
                response.data.overview);

            moviesArr.push(aMovie);
            async.resolve(moviesArr);

        }, function (error) {
            $log.log(error);
            async.reject("failed to get movie info");
        })
        return async.promise;
    }


    function loadMovies() {
        var async = $q.defer();

        moviesArr.length = 0;

        $http.get("/App/data/movies.json").then(function (response) {
            //console.log(JSON.stringify(response));
            var dataArr = response["data"];

            for (var i = 0; i < dataArr.length; i++) {
                $timeout(
                    addMovie(dataArr[i].tmdbID),
                    (300+i*100));
            }
            async.resolve(moviesArr);
        }, function (error) {
            $log.error(JSON.stringify(error));
            async.reject("failed to load movies.json");
        });

        return async.promise;
    }


    function serachMovie(searchStr, listItems) {
        var theUrl = "https://api.themoviedb.org/3/search/movie?api_key=" +
            API_KEY + "&language=en-US&query=" + searchStr + "&page=1&include_adult=false";
        var async = $q.defer();

        if (searchStr) {
            $http.get(theUrl).then(function (response) {
                for (var i = 0; i < response.data.results.length; i++) {
                    listItems[response.data.results[i].title] = response.data.results[i].id;
                }
                async.resolve(listItems);
            }, function (error) {
                $log.log(error);
                async.reject("failed to get movie info");
            })
        }
        else {
            listItems = {};
        }

        return async.promise;
    }

    function getMovieByID(tmdbID) {
        for (var i = 0; i < moviesArr.length; i++) {
            if (tmdbID === moviesArr[i].tmdbID)
                return moviesArr[i];
        }

        return undefined;
    }

    function getMovieDetails(id, movieDetails) {
        var detailsUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +
            API_KEY + "&language=en-US";
        var creditsUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +
            API_KEY + "&append_to_response=credits";
        var async = $q.defer();
        // var moviesArr[];

        //var savedDetails = getMovieByID(id);

        var premises = [];
        premises.push($http.get(detailsUrl));
        premises.push($http.get(creditsUrl));

        Promise.all(premises).then(function (response) {
            var actors = [];
            var director = "";
            var actorNum = (response[1].data.credits.cast.length > 5) ? 5 : response[1].data.credits.cast.length;

            for (var i = 0; i < actorNum; i++) {
                actors.push(response[1].data.credits.cast[i].name);
            }

            for (var i = 0; i < response[1].data.credits.crew.length; i++) {
                if (response[1].data.credits.crew[i].job === "Director")
                    director = response[1].data.credits.crew[i].name;
            }

            movieDetails["name"] = response[0].data.title;
            movieDetails["release_date"] = response[0].data.release_date;
            movieDetails["imageUrl"] = "https://image.tmdb.org/t/p/w400" + response[0].data.poster_path;
            movieDetails["actors"] = actors;
            movieDetails["director"] = director;
            movieDetails["length"] = min2HourStr.convMin2HourStr(response[1].data.runtime); //toString();
            movieDetails["imdbURL"] = "https://www.imdb.com/title/" + response[0].data.imdb_id;
            movieDetails["genre"] = response[0].data.genres[0].name;
            movieDetails["popularity"] = response[0].data.popularity;
            movieDetails["overview"] = response[0].data.overview;

            async.resolve(movieDetails);
        }, function (error) {
            $log.log(error);
            async.reject("failed to get movie info");
        });
        return async.promise;
    }

    function getMoviesArr() {
        return moviesArr;
    }
    return {
        addMovie: addMovie,
        serachMovie: serachMovie,
        getMovieDetails: getMovieDetails,
        getMoviesArr: getMoviesArr,
        loadMovies: loadMovies
    };
});