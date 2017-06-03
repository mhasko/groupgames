/**
 * Created by mhasko on 5/29/17.
 */
(function () {
    'use strict';

    angular
        .module('gameObjects',['services'])
        .directive('gameDetails', GameDetails)
        .directive('teamDetails', TeamDetails);

    GameDetails.$inject = [];
    function GameDetails() {
        var directive = {
            restict: 'E',
            scope: {data: '='},
            templateUrl: 'js/gameDetails/gameDetails.html',
            controller: function(){

            }
            //link: link
        };

        return directive;
    }

    TeamDetails.$inject = [];
    function TeamDetails() {
        var directive = {
            restrict: 'E',
            scope:{
                team:'=',
                side:'=',
                participants:"=",
                participantids:"=",
            },
            templateUrl: 'js/gameDetails/teamDetails.html',
            controller:TeamDetailsCtrl
        }
        return directive;
    }

    TeamDetailsCtrl.$inject = ['$filter', '$scope', 'services'];
    function TeamDetailsCtrl($filter, $scope, services){
        //$scope.getChampInfo = getChampInfo;

        function getChampInfo(sum){
            services.getChampDataForId(sum.championId).then(function(response){
                //sum['champName'] = response.data
                sum['champLink'] = getIconLink(response.data.image.full)
            },function(response){});
        }

        function getIconLink(rawName){
            //var name = rawName.replace(' ', '').replace('.','').replace('\'','');
            return "img/champion/"+rawName;
        }
        function init(){
            $scope.summoners = [];
            angular.forEach($scope.participants, function(part){
                if($scope.side === part.teamId){
                    var id = $filter('filter')($scope.participantids, {participantId: part.participantId},true)[0]
                    part['summonerName'] = id.player.summonerName;
                    part['summonerId'] = id.player.summonerId;
                    getChampInfo(part);

                    $scope.summoners.push(part);
                }
            })
        }

        init();
    }
})();