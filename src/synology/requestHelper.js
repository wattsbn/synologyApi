'use strict';
var HTTP = require('q-io/http');

function parseResponse(response) {
    return response.body.read().then(function (something) {
        var body = something.toString('UTF-8');
        var parsed;
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            throw 'Failure parsing response: ' + body.substring(0, 240);
        }
        
          if (!parsed) {
            throw 'There was no result returned...';
        }

        if (!parsed.success) {
            throw 'The request failed: ' + JSON.stringify(result);
        }

        return parsed;
    });
}

function checkResponse(response) {
    if (response.status !== 200) {
        throw 'Unexpected status code: ' + response.status;
    }
}

function makeBasicRequest(options) {
    return HTTP.request(options).then(function (response) {
        checkResponse(response);
        return parseResponse(response);
    });
}

function makeRawRequest(options) {
    return HTTP.request(options).then(function (response) {
        checkResponse(response);
        return response;
    });
}

function generateRequestOptions(server, endPoint, uri) {
    var options = {
        headers: {},
        host: server.host,
        port: server.port,
        path: endPoint.getUri() + (uri ? '&' + uri : '')
    };

    // Route request through Fiddler for debugging
    options.path = 'http://' + options.host + ':' + options.port + options.path;
    options.headers.host = options.host + ':' + options.port;
    options.host = '127.0.0.1';
    options.port = 8888;
    
    return options;
}

function RequestHelper() { }

RequestHelper.prototype.makeRequest = function (server, endPoint, uri) {
    var options = generateRequestOptions(server, endPoint, uri);
    return makeBasicRequest(options);
};

RequestHelper.prototype.makeRawRequest = function (server, endPoint, uri) {
    var options = generateRequestOptions(server, endPoint, uri);
    return makeRawRequest(options);
};

module.exports = new RequestHelper();