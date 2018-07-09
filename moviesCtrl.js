
actorApp.controller("moviesCtrl", function ($scope, movieService) {

    $scope.moviesArr = [];
    $scope.listItems = {};

    $scope.updateSearch = function (searchStr) {

        $scope.listItems = {};

        if (searchStr) {
            movieService.serachMovie(searchStr, $scope.listItems).then(function (success) {
                //do_nothing                    
            }, function (error) {
                console.log(error);
            })
        }
    }

    $scope.addMovie = function (id) {

        if (id != 0) {
            $scope.listItems = {};

            movieService.addMovie(id, $scope.moviesArr).then(function (sucess) {
                $scope.aFilter = "";
            }, function (error) {
                console.log(error);
            })
        }
    }
});