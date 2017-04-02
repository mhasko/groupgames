(function () {
    'use strict';

    angular
        .module('groupedGames',[])
        .controller('groupedGameCtrl', GroupedGameCtrl);


    GroupedGameCtrl.$inject = ['$scope', '$log', '$http'];
    function GroupedGameCtrl($scope, $log, $http){
        $scope.summoner1Results = "summoner data will appear here";

        $scope.getSummoner = function(){
            var url = '/api/summoner/'+ $scope.summonerName1;
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                $scope.summoner1Results = response.data;
            }, function errorCallback(response) {
                $scope.summoner1Results = 'err';
            });
        }
    }

})();