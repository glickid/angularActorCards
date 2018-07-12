
actorApp.factory("movieService", function ($http, $log, $q, $timeout, min2HourStr) {

    var API_KEY = "bce8cf411be52423d49e88adaa634d4a";

    function Movie(name, length, actors, director, poster, imdbUrl, description) {
        this.name = name;
        this.length = min2HourStr.convMin2HourStr(length); //toString();
        this.actors = actors
        this.director = director;
        this.imgUrl = "https://image.tmdb.org/t/p/w200/" + poster;
        this.imdbUrl = "https://www.imdb.com/title/" + imdbUrl;
        this.text = description;
    }

    function addMovie(id, moviesArr) {

        var theUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + 
                    API_KEY + "&append_to_response=credits";
        var async = $q.defer();
        // var moviesArr[];

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

    return {
        addMovie: addMovie,
        serachMovie: serachMovie
    };
});