
actorApp.controller("moviesCtrl", function ($scope, $http) {

    function Movie(name, length, actors, director, poster, imdbUrl, description) {
        this.name = name;
        this.length = length.toString();
        this.actors = actors
        this.director = director;
        this.imgUrl = poster;
        this.imdbUrl = imdbUrl;
        this.text = description;
    }

    $scope.moviesArr = [];

    var movie = new Movie("Se7en",
        287,
        ["Brad pitt","Morgan"],
        "the director",
        "https://image.tmdb.org/t/p/w200/zgB9CCTDlXRv50Z70ZI4elJtNEk.jpg",
        "https://www.imdb.com/title/tt0114369/",
        "the best Movie ever");

    $scope.moviesArr.push(movie);
    $scope.moviesArr.push(movie);
   
    $scope.updateSearch = function (aFilter) {
        $scope = aFilter;
    }
});