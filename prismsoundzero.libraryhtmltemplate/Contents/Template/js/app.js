'use strict';

/**
 * @ngdoc overview
 * @name musicApp
 * @description
 * # Prism Sound Zero Template App
 *
 * Main module of the application.
 */
angular
    .module('musicApp', [
        'ngSanitize',
        'cfp.hotkeys',
        'spotify',
        'ui.bootstrap'
    ])
    .config(['SpotifyProvider', '$sceDelegateProvider', function(SpotifyProvider, $sceDelegateProvider) {
        SpotifyProvider.setClientId(spotifyClientId);
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://*.spotify.com/**'
        ])
    }]);