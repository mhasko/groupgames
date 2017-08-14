/**
 * Created by mhasko on 6/3/17.
 */

(function(){
    'use strict';

    angular
        .module('services',[])
        .factory('services', Services)

    Services.$inject=['$http', 'backingData'];
    function Services($http, backingData){
        var theService = {
            getChampDataForId:getChampDataForId,
            getMatchDataFor:getMatchDataFor,
            getSummonerDataFor:getSummonerDataFor,
        };
        return theService;

        function getSummonerDataFor(summonerName){
            //summonerName is passed in here, so we create the url with the summoner name...
            var url = '/api/summoner/'+ summonerName;
            //...Then we use the url string to make the call to our API.  $http is an angular
            //  service that makes http calls, given a few parameters like the type of request
            //  in this case a GET, and url, in this case the url we created.  When we get a
            //  successful response back, we'll execute the code in the successCallback function,
            //  otherise if we get an error response we'll execute teh code in the errorCallback
            //  function.
            //
            //  Either way, we set the summoner1Results variable to either the response, or the
            //  string 'err'.  As this variable is bound to the template, we easily display the
            //  result to the user.
            var matchTypeParams = [];
            angular.forEach(backingData.matchType, function(useParam, queueType){
                if(useParam){
                    matchTypeParams.push(queueType);
                }
            });
            return $http({
                method: 'GET',
                url: url,
                params: {"matchType":matchTypeParams}
            });
        }

        function getMatchDataFor(matchId){
            var url = '/api/match/'+ matchId;

            return $http({
                method: 'GET',
                url: url
            })
        }

        function getChampDataForId(champId){
            var url = '/api/static/champ/' + champId;
            return $http({
                method: 'GET',
                url: url
            })
        }
    }
})();