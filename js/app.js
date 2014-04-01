var chattyServer = 'http://api.chatty';
// var chattyServer = 'http://ec2-54-186-222-29.us-west-2.compute.amazonaws.com/server';

angular.module('app', [])

.factory('sockjs', [function() {
    return new SockJS(chattyServer);
}])

.run([function() {

}])

.controller('main', ['$scope', 'sockjs', function($scope, sockjs) {
    $scope.count = 0;
    $scope.name  = 'Guest';
    $scope.messages = [{
        name: 'chatty',
        msg:'Welome to Chatty!',
    }];

    $scope.send = function () {
        var message = {
            name: $scope.name,
            msg: $scope.message,
            type: 'msg'
        };
        sockjs.send(JSON.stringify(message));

        $scope.message = '';
    };
    sockjs.onopen = function () {
        console.log('Connected!');
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
