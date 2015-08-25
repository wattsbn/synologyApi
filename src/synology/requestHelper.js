'use strict';
var HTTP = require('q-io/http');

function makeRequest(options) {
    return HTTP.request(options).then(function(response) {
        if (response.status < 200 || response.status >= 300) { return; }
        return response.body.read().then(function(something) {
            var body = something.toString('UTF-8');
            return JSON.parse(body);
        });
    });
}

function RequestHelper() { }

RequestHelper.prototype.makeRequest = function(server, endPoint, uri) {
    return makeRequest({
        host: server.host,
        port: server.port,
        path: endPoint.getUri() + (uri ? '&' + uri : '')
    });
};

module.exports = new RequestHelper();