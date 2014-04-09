describe('weatherCtrl', function() {
    var scope, q, _weatherApi, controller, _window, _getByCityOriginal;

    var createController = function() {
        return controller('weatherCtrl', {
            $scope: scope,
            $window: _window,
            weatherApi: _weatherApi
        });
    };

    beforeEach(module('app'));

    //dependency injection set up
    beforeEach(inject(function($controller, $rootScope, $q, weatherApi) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
        _weatherApi = weatherApi;
        _window = {
            alert: function(msg) {}
        };
    }));

    //mocks configuration for each test
    beforeEach(function() {
        var apiResults = {
            id: 1, name: "London", country: "GB",
            coord: { lon: -0.12574, lat: 51.50853 },
            weather: { temp: 290.3, pressure: 1024, temp_min: 288.15, temp_max: 291.48, humidity: 77,
            conditions: "cloudy",icon: "" }
        };

        var defer1 = q.defer();
        _getByCityOriginal = _weatherApi.getByCity;
        spyOn(_weatherApi, "getByCity").and.returnValue(defer1.promise);
        defer1.resolve(apiResults);

        spyOn(_window, "alert");
    });

    beforeEach(createController);

    it('should have an existing list of cities', function() {
        expect(scope.cities).toBeDefined();
        expect(scope.cities.length > 0).toBe(true);
    });

    it('should have order direction undefined when loaded', function() {
        expect(scope.orderBy).toBe("weather.temp");
    });

    it('should fetch weather from existing list of cities when loaded', function() {
        var expectedCalls = [];
        
        //loop for setting up expected results
        scope.cities.forEach(function(city) {
            expectedCalls.push({ name: city.name, country: city.country });
        });

        for (var i = 0; i < expectedCalls.length; i++) {
            expect(_weatherApi.getByCity).toHaveBeenCalledWith(expectedCalls[i]);
        };
    });

    it('should have completed weather information when loaded', function() {
        scope.$apply();

        scope.select.call(null, "London");

        expect(scope.selectedCity).toBeDefined();
        expect(scope.selectedCity.coord).toBeDefined();
        expect(scope.selectedCity.weather).toBeDefined();
    });

    it('should show error message when api fails', function() {
        _weatherApi.getByCity = _getByCityOriginal;

        var defer = q.defer();
        spyOn(_weatherApi, "getByCity").and.returnValue(defer.promise);
        defer.reject(new Error("Error!"));

        createController();

        scope.$apply();

        expect(_window.alert).toHaveBeenCalledWith("Error!");
        expect(_window.alert.calls.count()).toBe(scope.cities.length);
    });
});