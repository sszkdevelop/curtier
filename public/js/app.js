var app = angular.module('myApp', ['ngAnimate', 'ngMaterial']);

app.controller('myCtrl', function ($scope, $http) {
    $scope.text = "";

    $scope.logs = [];

    var wrap = function (text) {
        return {
            "text": $scope.text
        };
    };

    $scope.query = function () {
        $http.post('/analyze', wrap($scope.text))
            .then(function (res) {
                if(res.data){
                    console.log(res.data);
                    $scope.logs.push(res.data);
                }
            }, function (err) {
                console.log('error!');
                console.log(err);
            });
    };
});