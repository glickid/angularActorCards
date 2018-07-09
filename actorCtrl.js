
actorApp.controller("actorCtrl", function ($scope, actorService) {

    $scope.actorArr = actorService.loadActors();

    $scope.aFilter = "";
    $scope.propName = "";
    $scope.reverse = false;
    $scope.fields = { "First Name": "fname", "Last Name": "lname", "Birth Date": "bday" };

    //filter a spcific actor on the view
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

    //order gallery 
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
        //start search only after 3 charachters of input
        if (input.length > 3) {
            $scope.actressList = {};

            actorService.searchActress(input, $scope.actressList).then(function (success) {
                //do_nothing
            }, function (error) {
                $log.error(error);
                $scope.actressList = {};
            });
        }
        else {
            $scope.actressList = {};
        }
    }

    $scope.addActress = function (id) {
        actorService.addActress(id).then(function (actorArr) {
            $scope.actorArr = actorArr;
            $scope.actressList = {};
            $scope.input = "";
        }, function (error) {
            console.log("error")
        });
    }
});