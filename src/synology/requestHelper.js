'use strict';
var HTTP = require('q-io/http');

function makeRequest(options) {
    return HTTP.request(options).then(function(response) {
        if (response.status !== 200) {
            throw 'Unexpected status code: ' + response.status;
        }
        return response.body.read().then(function(something) {
            var body = something.toString('UTF-8');
            var parsed;
            try {
                parsed = JSON.parse(body);
            } catch(e) {
                throw 'Failure parsing response: ' + body.substring(0, 240);
            }
            return parsed;
        });
    });
}


function RequestHelper() { }

RequestHelper.prototype.makeRequest = function(server, endPoint, uri) {
    return makeRequest({
        host: server.host,
        port: server.port,
        path: endPoint.getUri() + (uri ? '&' + uri : '')
    }).then(function(result) {
        if (!result) {
            throw 'There was no result returned...';
        }

        if (!result.success) {
            throw 'The request failed: ' + JSON.stringify(result);
        }
        return result;
    });
};


module.exports = new RequestHelper();