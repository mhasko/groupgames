(function () {
    'use strict';

    //This is angular boilerplate for creating an angular module.  This module's name
    //  is groupedGames.  We can include other angular modules by listing them inside the
    //  square brackets.  Since we're not including any other modules right now, the brackets
    //  are empty.
    //
    //  We then create the groupedGameCtrl controller.  The name of any given controller
    //  is the first parameter of the .controlller() function, and its defination is the
    //  second parameter.  A lot of other code you'll see online has an inline anonomus
    //  function (ex .controller(nameCtrl, function(){ -- lots of code });), but I like to
    //  create a named function and just add the name of that funciton in this line.  It's
    //  a few more lines of code, but it is cleaner and easier to debug (This matches with
    //  John Papa's angular style guide https://github.com/johnpapa/angular-styleguide/tree/master/a1
    angular
        .module('groupedGames',[])
        .controller('groupedGameCtrl', GroupedGameCtrl);


    //Angular's secret sauce is injecting things when they are needed.  Again, in a lot of
    //  online code you'll see injection different ex:
    // .controller('nameCtrl',
    //  ['$location', '$routeParams', 'common', 'dataservice',
    //    function Dashboard($location, $routeParams, common, dataservice) {}
    //  ]);
    // but that's hard to read and doesn't explictly call out what's going on.  Using the
    // $inject service on a function then having the function definiation with the injected
    // services as parrams into the controller function helps spell out what's going on and
    // makes the code cleaner without having additional private anon functions everywhere.
    GroupedGameCtrl.$inject = ['$scope', '$log', '$http', '$q'];
    function GroupedGameCtrl($scope, $log, $http, $q){

        //This will be be the raw backing object for the app
        $scope.summonerRawData = {};

        //Sets the getData function to the scope, so the DOM can call it
        $scope.getData = getData;

        function getData() {
            //Reset the backing data object on every press of the button
            $scope.summonerRawData = {};
            $scope.matchedIds = [];

            //Every http call returns a promise, which we're stashing in here.  We
            //  can use the $q.all funciton to execute code once all the promises in
            //  a collection are resolved.  We want to run actions on all the data, but
            //  only once it has been loaded...
            var allLoadingPromises = [];

            //Parse the inputString, each summoner name should be comma delimited,
            //  then pass each name into the getSummonerDataFor function
            angular.forEach($scope.summonerNames.split(','), function(name){
                allLoadingPromises.push(getSummonerDataFor(name).then(function successCallback(response) {
                    //We have fetched data, stash it in the backing raw data object with the
                    //  summoner's name as the key
                    $scope.summonerRawData[name]=response.data;
                }, function errorCallback(response) {
                    $scope.summonerRawData[name]= 'err';
                }));
            });

            //Once all the data loads, we need to then find the intersections of all the
            //  matchIds.
            $q.all(allLoadingPromises).then(function(){
                var findIntersectionsIn = [];
                angular.forEach($scope.summonerRawData, function(data, sumname){
                    data.matchArray = createArrayOfParam(data.matches,'matchId');
                    findIntersectionsIn.push(data.matchArray);
                });
                //matchedIds is on the scope so the DOM can access it.
                $scope.matchedIds = intersectionOfArrays(findIntersectionsIn);
            })
        }

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
            return $http({
                method: 'GET',
                url: url
            });
        }

        //Utility function to create an array of one value from an array of objects.
        function createArrayOfParam(dataObject, param){
            var array = [];
            angular.forEach(dataObject, function(obj){
                array.push(obj[param]);
            });
            return array;
        }

        //The goal of this app is to find what matchIds everyone listed shares.  We'll
        //  have many arrays of matchId, but a variable amount of arrays that we need
        //  to find all the intersections of.  This first attempt is a brute force way
        //  of finding them.
        function intersectionOfArrays(arrayOfArrays){
            //If we only have one or none, just return it and move on
            if(arrayOfArrays.length <= 1){return arrayOfArrays;}

            //We can assume we have at least 2 arrays now.  So what we're
            //  going to do is pop the first array, and use that as our
            //  known matching set.  We'll compare each value against the
            //  next array, keeping only values that are in both in our
            //  known matching set.  The we'll keep going through all the
            //  arrays in this manner.
            var matchingSet = arrayOfArrays.pop();

            angular.forEach(arrayOfArrays, function(sumMatches){
                var newMatchingSet = [];
                angular.forEach(matchingSet, function(matchedId){
                    if(sumMatches.indexOf(matchedId) > -1){
                        newMatchingSet.push(matchedId);
                    }
                });

                matchingSet = newMatchingSet;
            });

            return matchingSet;
        }

    }

})();