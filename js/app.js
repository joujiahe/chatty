var chattyServer = 'http://api.chatty';
// var chattyServer = 'http://ec2-54-186-222-29.us-west-2.compute.amazonaws.com/server';

angular.module('app', [])

.factory('sockjs', [function() {
    return new SockJS(chattyServer);
}])

.config([function() {

}])

.run([function() {

}])

.controller('main', ['$scope', 'sockjs', '$location', function($scope, sockjs, $location) {

    $scope.channel = $location.path() && $location.path().slice(1) || 'chatty';
    $scope.channelUrl = $location.absUrl();

    $scope.count = 0;
    $scope.name  = 'Guest';
    $scope.messages = [{
        name: 'chatty',
        msg:'Welome to Chatty!',
    }];

    $scope.subscribe = function() {
        var message = {
            channel: $scope.channel,
            type: 'subscribe'
        };
        sockjs.send(JSON.stringify(message));

    }
    $scope.send = function () {
        var message = {
            channel: $scope.channel,
            name: $scope.name,
            msg: $scope.message,
            type: 'msg'
        };
        sockjs.send(JSON.stringify(message));

        $scope.message = '';
    };
    sockjs.onopen = function () {
        console.log('Connected!');
        $scope.subscribe();
    };
    sockjs.onmessage = function (e) {
        console.log(e);
        var data = JSON.parse(e.data);
        $scope.$apply(function() {
            switch (data.type) {
            case 'count':
                onCount(data.count);
                break;
            case 'msg':
                onMessage(data);
                break;
            default:
                console.log(data);
                break;
            }
        });
    };

    var onCount = function (count) {
        $scope.name += count;
        $scope.count = count;
        onCount = function (count) {
            $scope.count = count;
        }
    };
    var onMessage = function (message) {
        $scope.messages.push(message);
    };
}]);
