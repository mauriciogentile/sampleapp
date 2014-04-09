angular
  .module("app.services")
  .service("weatherApi", function($http, $q) {
    return {
      getByCity: function(city) {
        var defer = $q.defer();

        if(!city.name || !city.country) {
          defer.reject(new Error("Country or City no spcified!"));
          return defer.promise;
        }

        $http.get("http://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city.name + "," + city.country)
        .then(function(response) {
          
          var data = {
            id: response.data.id,
            name: response.data.name,
            country: response.data.sys.country,
            coord: response.data.coord,
            weather: response.data.main
          };
          data.weather.main = response.data.weather[0].main;
          data.weather.description = response.data.weather[0].description;
          data.weather.icon = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png";

          defer.resolve(data);
        })
        .catch(function(err) {
          defer.reject(err);
        });

        return defer.promise;
      }
    };
});