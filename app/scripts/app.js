'use strict';

/**
 * @ngdoc overview
 * @name sacoForaldraforsakringApp
 * @description
 * # sacoForaldraforsakringApp
 *
 * Main module of the application.
 */
var app = angular
  .module('sacoForaldraforsakringApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.bootstrap-slider',
    'angular-toArrayFilter',
    'n3-line-chart',
    //'angularytics'
  ])
  /*
  // For Google Anayltics: https://github.com/mgonto/angularytics
  .config(function(AngularyticsProvider) {
    AngularyticsProvider.setEventHandlers(['GoogleUniversal']);
  }).run(function(Angularytics) {
    Angularytics.init();
  });*/
