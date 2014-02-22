angular.module('pghpy', [])
.filter('trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])
.filter('isPast', [function() {
    return function(input) {
        date = new Date(input);
        today = new Date();

        if (date < today) {
          return 'past';
        }

        return false;
    };
}])
.filter('htmlify', ['$sce', function($sce) {
    var htmlify = function(input, lookup) {
        console.log('Lookup', lookup);
        if (Object.prototype.toString.call(input) === '[object Object]') {
            text = input.name;

            if ('url' in input) {
              output = link = document.createElement('a');
              link.href = input.url;
              link.appendChild(document.createTextNode(text));

              return link.outerHTML;
            }

            return text;
        } else if (Object.prototype.toString.call(input) === '[object Array]') {
            length = input.length;
            output = '';
            for (i in input) {
                if (i > 0 && i < length - 1) {
                    output += ', ';
                } else if (i > 0 && i == length - 1) {
                    output += ' & ';
                }

                output += htmlify(input[i], lookup);
            }

            return output;
        } else if (Object.prototype.toString.call(input) === '[object String]') {
            if (input in lookup) {
                return htmlify(lookup[input], lookup);
            }
            return input;
        }
    };

    return htmlify;
}])
.controller('EventListCtrl', ['$http', '$scope', function($http, $scope) {
    $scope.events = [];
    $http.get('/events.json').then(function(data) {
        $scope.events = data.data.events;
        $scope.presenters = data.data.presenters;
        $scope.locations = data.data.locations;
    });
}]);
