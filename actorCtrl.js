
actorApp.controller("actorCtrl", function ($scope, $http) {
    var API_KEY = "bce8cf411be52423d49e88adaa634d4a";

    function Actor(fname, lname, bday, imageUrl, imdbUrl, text) {
        this.fname = fname;
        this.lname = lname
        this.bday = new Date(bday);
        this.imgUrl = (imageUrl[0] === 'h') ? imageUrl : "https://image.tmdb.org/t/p/w200/" + imageUrl;
        this.imdbUrl = (imdbUrl[0] === 'h') ? imdbUrl : "https://www.imdb.com/title/" + imdbUrl;;
        this.text = text;
    }

    $scope.actorArr = [];
    $http.get("./actors.json").then(function (response) {
        //console.log(JSON.stringify(response));
        var dataArr = response["data"];
        for (var i = 0; i < dataArr.length; i++) {
            var actor_t = new Actor(dataArr[i].fname,
                dataArr[i].lname,
                dataArr[i].bday,
                dataArr[i].imageUrl,
                dataArr[i].imdbUrl,
                dataArr[i].text);
            $scope.actorArr.push(actor_t);
            // console.log(dataArr[i]);
        }
    }, function (error) {
        console.log(JSON.stringify(error));
    });

    $scope.aFilter = "";
    $scope.propName = "";
    $scope.reverse = false;
    $scope.fields = { "First Name": "fname", "Last Name": "lname", "Birth Date": "bday" };

    $scope.actorFilter = function (actor) {
        var lowerFname = actor.fname.toLowerCase();
        var lowerLname = actor.lname.toLowerCase();
        if (lowerFname.includes($scope.aFilter) || lowerLname.includes($scope.aFilter) ||
            actor.fname.includes($scope.aFilter) || actor.lname.includes($scope.aFilter)) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.changeOrderBy = function (prop) {
        if ($scope.propName === prop) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.reverse = false;
            $scope.propName = prop;
        }
    }

    $scope.changeOrderBy($scope.selectedName);
    $scope.chosenActor = "";


    $scope.updateOverClass = function (actor) {
        $scope.chosenActor = actor;
    }
    $scope.updateMouseLeave = function (actor) {
        $scope.chosenActor = actor;
    }

    $scope.actressList = {};


    $scope.searchActress = function (input) {

        if (input.length > 3) {
            $scope.actressList = {};
            var namesUrl = "https://api.themoviedb.org/3/search/person?api_key=" + API_KEY + "&language=en-US&query=" + input + "&page=1&include_adult=false"

            $http.get(namesUrl).then(function (response) {
                for (i = 0; i < response.data.results.length; i++) {
                    var actorId = response.data.results[i].id;
                    var detailsUrl = " https://api.themoviedb.org/3/person/" + actorId + "?api_key=" + API_KEY + "&language=en-US";

                    $http.get(detailsUrl).then(function (response1) {
                        if (response1.data.gender === 1)
                            $scope.actressList[response1.data.name] = response1.data.id;
                    }, function (error) {
                        console.log(error);
                    })
                }
            }, function (error) {
                console.log(error);
                $scope.actressList = {};
            })
        }
        else {
            $scope.actressList = {};
        }
    }

    $scope.addActress = function (id) {

        var detailsUrl = " https://api.themoviedb.org/3/person/" + id + "?api_key=" + API_KEY + "&language=en-US";

        $http.get(detailsUrl).then(function (response1) {
            var nameSplit = response1.data.name.split(" ");
            var bioSplit = response1.data.biography.split(".");

            var actress = new Actor((nameSplit.length > 2) ? nameSplit[0] + " " + nameSplit[1] : nameSplit[0],
                (nameSplit.length > 2) ? nameSplit[2] : nameSplit[1],
                response1.data.birthday,
                response1.data.profile_path,
                response1.data.imdb_id,
                (bioSplit.length>2) ?  bioSplit[0] + ". " + bioSplit[1] : response1.data.biography);

            $scope.actorArr.push(actress);

        }, function (error) {
            console.log(error);
        })
    }

});