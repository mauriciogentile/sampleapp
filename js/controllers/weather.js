"use strict";

app.controller("weatherCtrl", function($scope, $window, weatherApi) {
    $scope.selectedCity = null;

    $scope.select = function(name) {
      $scope.selectedCity = find($scope.cities, name);
    };

    //order by is controlled by angular's built-in filters
    $scope.orderBy = "weather.temp";


    //hardcoded list of cities
    $scope.cities = [
        { name: "London", country: "GB"},
        { name: "Luton", country: "GB"},
        { name: "Manchester", country: "GB"},
        { name: "Birmingham", country: "GB"}
    ];

    //loop cities to get more information to be shown on the list
    $scope.cities.forEach(function(city) {
      weatherApi.getByCity(city)
      .then(function(data) {
        city.coord = data.coord;
        city.weather = data.weather;
      }).
      catch(function (error) {
        $window.alert(error.message);
      });
    });

    //TODO: this could be in a helper module maybe
    var find = function(input, name) {
      var i = 0, len = input.length;
      for (; i<len; i++) {
        if (input[i].name == name) {
          return input[i];
        }
      }
    };
});