'use strict';

/**
 * @ngdoc directive
 * @name musicApp.directive:copyValue
 * @description
 * # copyValue
 * Directive of the musicApp
 */
angular.module('musicApp').directive('copyValue', function () {
    return {
        restrict: 'A',
        scope: {
            model: '='
        },
        link: function (scope, element) {
            scope.model = element.text();
        }
    }
});
