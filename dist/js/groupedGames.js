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
    GroupedGameCtrl.$inject = ['$scope', '$log', '$http'];
    function GroupedGameCtrl($scope, $log, $http){
        //summoner1Results is now a variable on the controller scope.  This allows the template
        //  to access summoner1Results
        $scope.summoner1Results = "summoner data will appear here";

        $scope.getSummoner = function(){
            //Likewise, summonerName1 was defined in scope in the template, and now we can
            //  accesss what ever the value is here.  We pull the string value from the input
            //  field, and add it to this url string...
            var url = '/api/summoner/'+ $scope.summonerName1;
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