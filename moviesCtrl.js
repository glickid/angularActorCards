
actorApp.controller("moviesCtrl", function ($scope, $http) {
    var API_KEY = "bce8cf411be52423d49e88adaa634d4a";

    function Movie(name, length, actors, director, poster, imdbUrl, description) {
        this.name = name;
        this.length = length.toString();
        this.actors = actors
        this.director = director;
        this.imgUrl = "https://image.tmdb.org/t/p/w200/" + poster;
        this.imdbUrl = "https://www.imdb.com/title/" + imdbUrl;
        this.text = description;
    }

    $scope.moviesArr = [];

    // var movie = new Movie("Se7en",
    //     287,
    //     ["Brad pitt", "Morgan"],
    //     "the director",
    //     "https://image.tmdb.org/t/p/w200/zgB9CCTDlXRv50Z70ZI4elJtNEk.jpg",
    //     "https://www.imdb.com/title/tt0114369/",
    //     "the best Movie ever");

    // $scope.moviesArr.push(movie);
    // $scope.moviesArr.push(movie);
    $scope.listItems = {};

    $scope.updateSearch = function (searchStr) {
        var theUrl = "https://api.themoviedb.org/3/search/movie?api_key=" +
            API_KEY + "&language=en-US&query=" + searchStr + "&page=1&include_adult=false";

        $scope.listItems = {};

        if (searchStr) {
            $http.get(theUrl).then(function (response) {
                for (var i = 0; i < response.data.results.length; i++) {
                    $scope.listItems[response.data.results[i].title] = response.data.results[i].id;
                }
            }, function (error) {
                console.log(error);
            })
        }
        else {
            $scope.listItems = {};
        }
    }

    $scope.addMovie = function (id) {
        
        if (id != 0) {
            $scope.listItems = {};
            var theUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + API_KEY + "&append_to_response=credits";
            
            $http.get(theUrl).then(function (response) {
                var actors = [];
                var director = "";

                for (var i = 0; i < 3; i++)
                    actors.push(response.data.credits.cast[i].name)
                for (var i = 0; i < response.data.credits.crew.length; i++) {
                    if (response.data.credits.crew[0].job === "Director")
                        director = response.data.credits.crew[0].name;
                }
                var aMovie = new Movie(response.data.title,
                    response.data.runtime,
                    actors,
                    director,
                    response.data.poster_path,
                    response.data.imdb_id,
                    response.data.overview);

                $scope.moviesArr.push(aMovie);
                //name, length, actors, director, poster, imdbUrl, description) {
            }, function (error) {
                console.log(error);
            })
        }
        // else {

        // }
        //http://api.themoviedb.org/3/movie/807/casts?api_key=bce8cf411be52423d49e88adaa634d4a
    }
});