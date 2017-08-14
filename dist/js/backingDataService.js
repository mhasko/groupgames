/**
 * Created by mhasko on 6/3/17.
 */

(function(){
    'use strict';

    angular
        .module('services')
        .factory('backingData', BackingData)

    BackingData.$inject=['$http'];
    function BackingData($http){
        var theService = {
            matchType: {
                TEAM_BUILDER_RANKED_SOLO: true,
                RANKED_FLEX_SR: true,
            },
        };
        return theService;
    }
})();