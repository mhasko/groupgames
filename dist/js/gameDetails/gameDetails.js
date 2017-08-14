/**
 * Created by mhasko on 5/29/17.
 */
(function () {
    'use strict';

    //This is angular boilerplate for creating an angular module.  This module's name is
    //  gameDetails, and requires the services module as denoted inside the square bracket
    angular
        .module('gameObjects',['services'])
        .directive('gameDetails', GameDetails);

    GameDetails.$inject = [];
    function GameDetails() {
        var directive = {
            restict: 'E',
            scope: {
                data: '=',
                searchedNames: '='
            },
            templateUrl: 'js/gameDetails/gameDetails.html',
            controller: GameDetailsCtrl
        };
        return directive;
    }

    GameDetailsCtrl.$inject = ['$filter', '$scope'];
    function GameDetailsCtrl($filter, $scope){
        $scope.gameDate = getDateFromMilli($scope.data.gameCreation);
        $scope.isSearchedTeam = isSearchedTeam;

        function getDateFromMilli(milli) {
            var date = new Date(milli);
            var dd = date.getDate();
            var mm = date.getMonth()+1; //January is 0!
            var yyyy = date.getFullYear();

            if(dd<10) {
                dd='0'+dd
            }

            if(mm<10) {
                mm='0'+mm
            }

            return mm+'/'+dd+'/'+yyyy;
        }
        function isSearchedTeam(teamId){
            //We need to take our list of searched names and go through all 10 values in
            //  data.participantIdentities. Any match is the team id that we want to compare
            //  to the passed in value.  Cases where members listed are on opposite teams
            //  will cause this function to work in uncertain ways, but that case is rare enough
            //  to ignore for our logic.  I hope.
            var foundId;

            angular.forEach($scope.searchedNames, function(name){
                if(!foundId){
                    var result = $filter('filter')($scope.data.participantIdentities, {$:name});
                    if( result.length > 0){
                        foundId =
                            $filter('filter')($scope.data.participants, {participantId: result[0].participantId})[0].teamId;
                    }
                }
            });

            return foundId === teamId;
        }
    }
})();