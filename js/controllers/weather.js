app.controller("weatherCtrl", function($scope, $window, weatherApi) {
    
    $scope.selectedCity = null;

    $scope.select = function(name) {
      $scope.selectedCity = find($scope.cities, name);
    };

    //order by is controlled by angular's built-in filters
    $scope.orderBy = "weather.temp";

    $scope.cities = [
        { name: "London", country: "GB"},
        { name: "Luton", country: "GB"},
        { name: "Manchester", country: "GB"},
        { name: "Birmingham", country: "GB"}
    ];

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

    var find = function(input, name) {
      var i = 0, len = input.length;
      for (; i<len; i++) {
        if (input[i].name == name) {
          return input[i];
        }
      }
      return null;
    };
    
    $scope.mySearchCallback = function(params) {

      var defer = $q.defer();

      $http.jsonp("http://gd.geobytes.com/AutoCompleteCity?callback=JSON_CALLBACK&q=" + params.query)
        .then(function(response) {
          if(!response.data) {
            defer.resolve([]);
          }
          var cities = response.data.map(function(city) {
            var parts = city.split(",");
            return {
              fullName: city,
              city: parts[0],
              state: parts[1],
              country: parts[2]
            };
          });
          defer.resolve(cities);
        })
        .catch(function(e) {
          $window.alert(e.message);
          defer.reject(e);
        });

        return defer.promise;
    };
});