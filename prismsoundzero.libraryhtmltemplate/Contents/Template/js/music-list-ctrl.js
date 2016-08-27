'use strict';

var sample = sample || undefined;

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MusicListController
 * @description
 * # MusicListController
 * Controller of the musicApp
 */
angular.module('musicApp')
    .controller('MusicListController', ['$rootScope', '$scope', '$location', '$filter', '$http', '$anchorScroll', 'hotkeys', 'Spotify', function ($rootScope, $scope, $location, $filter, $http, $anchorScroll, hotkeys, Spotify) {

        $scope.selectItem = function (item) {
            $scope.models.selected = item;
            $location.search({id: item.id});
        };

        function searchArtist(name) {
            $scope.models.selectedArtistSpotifyInfo = undefined;
            $scope.models.selectedArtistLastFmInfo = undefined;
            Spotify.search(name, 'artist').then(function (data) {
                if (data.artists.total > 0) {
                    $scope.models.selectedArtistSpotifyInfo = data.artists.items[0];
                    selectImage();
                    if (lastFmKeyApiKey) {
                        $http.get(lastFmApiBase, {params: {
                            method: 'artist.getinfo',
                            artist: name,
                            api_key: lastFmKeyApiKey,
                            format: 'json'
                        }}).then(function (response) {
                            $scope.models.selectedArtistLastFmInfo = response.data.artist;
                        }, function (response) {
                            console.error('lastFm', response);
                        });
                    }
                }
            });
        }

        function searchAlbum(title, artist) {
            $scope.models.selectedAlbumSpotifyInfo = undefined;
            $scope.models.selectedAlbumLastFmInfo = undefined;
            Spotify.search('album:' + title + ' artist:' + artist, 'album').then(function (data) {
                //console.log('spotify', data);
                if (data.albums.items && data.albums.items[0]) {
                    $scope.models.selectedAlbumSpotifyInfo = data.albums.items[0];
                    $scope.models.selectedAlbumSpotifyUrl = 'https://embed.spotify.com/?uri=' + $scope.models.selectedAlbumSpotifyInfo.uri;
                }
                if (lastFmKeyApiKey) {
                    $http.get(lastFmApiBase, {params: {
                        method: 'album.getInfo',
                        artist: artist,
                        album: title,
                        api_key: lastFmKeyApiKey,
                        format: 'json'
                    }}).then(function (response) {
                        //console.log('lastFm', response.data);
                        $scope.models.selectedAlbumLastFmInfo = response.data.album;
                        //if ($scope.models.selectedAlbumLastFmInfo.mbid) {
                        //    $http.get('http://musicbrainz.org/ws/2/release/' + $scope.models.selectedAlbumLastFmInfo.mbid, {params: {
                        //        inc: 'aliases',
                        //        fmt: 'json'
                        //    }}).then(function (response) {
                        //        console.log(response);
                        //    });
                        //}
                    });
                }
            });
        }

        function selectImage() {
            if ($scope.models.selectedArtistSpotifyInfo.images) {
                var best = $scope.models.selectedArtistSpotifyInfo.images[0];
                angular.forEach($scope.models.selectedArtistSpotifyInfo.images, function (image) {
                    if (image.width > 100 && image.height > 100) {
                        best = image;
                    }
                });
                $scope.models.selectedArtistSpotifyImage = best;
            }
        }

        $scope.selectArtist = function (artist) {
            $location.search({artist: artist});
            searchArtist(artist);
        };

        $scope.search = function () {
            $location.search({q: $scope.models.query});
        };

        $scope.back = function () {
            $location.search({});
        };

        $scope.changeLimit = function (limit) {
            $scope.models.currentPage = Math.floor(($scope.models.limitOffset + $scope.models.limit - 1) / limit) + 1;
            $scope.models.limit = limit;
            $scope.changePage();
        };

        $scope.changePage = function () {
            $scope.models.limitOffset = ($scope.models.currentPage - 1) * $scope.models.limit;
            $anchorScroll('top');
        };

        $rootScope.$on('$locationChangeStart', function () {
            var artist = $location.search().artist,
                id = $location.search().id,
                q = $location.search().q;
            $scope.models.query = undefined;
            // Artist
            if (artist) {
                $scope.models.selectedArtist = artist;
                $rootScope.title = artist;
                searchArtist(artist);
            } else {
                $scope.models.selectedArtist = undefined;
            }
            // Album
            if (id) {
                if (!$scope.models.selected || $scope.models.selected.id !== id) {
                    $scope.models.selected = $filter('filter')($scope.items, {id: id}, true)[0];
                }
                searchAlbum($scope.models.selected.title, $scope.models.selected.artist);
                $rootScope.title = $scope.models.selected.title + ' | ' + $scope.models.selected.artist;
            } else {
                $scope.models.selected = undefined;
            }
            // Search
            if (q) {
                $scope.models.q = q;
                $rootScope.title = 'Search: ' + q;
            } else {
                $scope.models.q = undefined;
            }

            if (!artist && !id && !q) {
                $rootScope.title = undefined;
            }
        });

        hotkeys.add({
            combo: 'mod+f',
            description: 'Search',
            allowIn: ['INPUT'],
            callback: function (event) {
                event.preventDefault();
                angular.element('#search').focus();
            }
        });

        hotkeys.add({
            combo: 'esc',
            description: 'Clear search',
            allowIn: ['INPUT'],
            callback: function (event) {
                event.preventDefault();
                $scope.models.query = undefined;
            }
        });

        function parseData() {
            var artists = [],
                items = [],
                shelves = [];

            angular.forEach(angular.element('.medium-item'), function (element) {
                element = angular.element(element);
                var item = {
                    id: element.attr('data-uuid'),
                    title: element.attr('title'),
                    artist: element.attr('data-artist'),
                    description: element.attr('data-description'),
                    asin: element.attr('asin'),
                    rating: element.attr('rating')
                };
                items.push(item);
                if (artists.indexOf(item.artist) === -1) {
                    artists.push(item.artist);
                }
            });

            angular.forEach(angular.element('.shelf_selection').find('a'), function (element) {
                element = angular.element(element);
                shelves.push({
                    href: element.attr('href'),
                    name: element.text(),
                    selected: element.hasClass('selected')
                });
            });
            if (angular.isDefined(sample)) {
                $scope.artists = sample.artists;
                $scope.items = sample.items;
                $scope.shelves = sample.shelves;
            } else {
                $scope.artists = artists;
                $scope.items = items;
                $scope.shelves = shelves;
            }
            $scope.loaded = true;
        }

        (function init() {
            $scope.models = {};
            $scope.items = [];
            $scope.shelves = [];
            $scope.models.limits = [25, 50, 100];
            $scope.models.limit = 50;
            $scope.models.limitOffset = 0;
            $scope.models.currentPage = 1;
            parseData();
        }());

    }]);