describe('weatherApi', function() {
    var scope, q, _weatherApi, controller, _window, httpBackend;

    beforeEach(module('app'));

    beforeEach(inject(function($httpBackend) {
        httpBackend = $httpBackend;
        $httpBackend.whenGET('http://api.openweathermap.org/data/2.5/weather?units=imperial&q=London,GB')
        .respond({"coord":{"lon":-0.13,"lat":51.51},"sys":{"message":0.0375,"country":"GB","sunrise":1397020588,"sunset":1397069247},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"base":"cmc stations","main":{"temp":287.48,"pressure":1023,"temp_min":285.93,"temp_max":289.26,"humidity":73},"wind":{"speed":2.57,"gust":4.63,"deg":307},"clouds":{"all":32},"dt":1397069470,"id":2643743,"name":"London","cod":200});
    }));

    //dependency injection set up
    beforeEach(inject(function(weatherApi) {
        _weatherApi = weatherApi;
    }));

    //TODO: many more validations needed
    it('should convert original json response to simplified api response', function() {
        var promise = _weatherApi.getByCity({name: "London", country: "GB"});
        promise.then(function(data) {
            expect(data.coord).toBeDefined();
            expect(data.weather).toBeDefined();
        });
        httpBackend.flush();
    });

    it('should return error if city or country are not specified', function() {
        var promise = _weatherApi.getByCity({});
        promise.then(function(data) {
            expect(false).toBe(true);
        })
        .catch(function(error) {
            expect(error).toBeDefined();
        });
    });
});