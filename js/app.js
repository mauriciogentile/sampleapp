"use strict";

var app = angular.module("app", []);

var app = angular.module("app", ["ng", "ngRoute", "app.controllers", "app.services"]);

angular.module("app.services", []);

angular.module("app.controllers", ["app.services"]);

var routeProvider = function ($routeProvider) {
    $routeProvider.
      when("/weater", { templateUrl: "partialView/weater.html", controller: "weatherCtrl" }).
      otherwise({ redirectTo: "/weater" });
};

app.config(["$routeProvider", routeProvider]);