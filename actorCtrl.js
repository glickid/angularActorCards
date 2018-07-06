
actorApp.controller("actorCtrl", function ($scope, $http) {

    function Actor(fname, lname, bday, imageUrl, imdbUrl, text) {
        this.fname = fname;
        this.lname = lname
        this.bday = new Date(bday);
        this.imgUrl = imageUrl;
        this.imdbUrl = imdbUrl;
        this.text = text;
    }

    $scope.actorArr = [];
    $http.get("./actors.json").then( function (response){
        //console.log(JSON.stringify(response));
        var dataArr = response["data"];
        for(var i=0; i<dataArr.length; i++)
        {
            var actor_t =new Actor(dataArr[i].fname,
                                    dataArr[i].lname,
                                    dataArr[i].bday,
                                    dataArr[i].imageUrl,
                                    dataArr[i].imdbUrl,
                                    dataArr[i].text);
            $scope.actorArr.push(actor_t);
            console.log(dataArr[i]);
        }
    }, function (response){
        console.log(JSON.stringify(response));
    });

$scope.aFilter = "";
$scope.propName = "";
$scope.reverse = false;
$scope.fields = {"First Name": "fname", "Last Name" : "lname", "Birth Date":"bday"};

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
    if ($scope.propName === prop)
    {
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


});