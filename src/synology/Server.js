'use strict';
var q = require('q');
var _ = require('underscore');
var endpoints = require('./endPoints');
var requestHelper = require('./requestHelper');

function Server(host, port) {
    this.host = host;
    this.port = port || '5000';
    this.sid = null;
}

Server.prototype.updateEndpoints = function() {
    var uri = 'method=query&query=';
    var map = {};
    _.each(endpoints, function(endpoint) {
        uri += endpoint.name + ',';
        map[endpoint.name] = endpoint;
    });
    var deferredResult = q.defer();
    requestHelper.makeRequest(this, endpoints.info, uri).then(function(result) {
        if (!result || !result.success) { return deferredResult.reject(); }
        _.each(result.data, function(data, name) {
            map[name].update(data);
        });
        deferredResult.resolve();
    }, function(error) {
        console.log(error);
        deferredResult.reject();
    });
    return deferredResult.promise;
};

Server.prototype.authenticate = function(username, password) {
    var uri = 'method=login&account=' + username + '&passwd=' + password;
    uri += '&session=DownloadStation&format=sid';
    var deferredResult = q.defer();
    requestHelper.makeRequest(this, endpoints.auth, uri).then(function(result) {
        if (!result || !result.success) { return deferredResult.reject(); }
        this.sid = result.data.sid;
        deferredResult.resolve();
    }.bind(this), function(error) {
        console.log(error);
        deferredResult.reject();
    });
    return deferredResult.promise;
};

Server.prototype.getTaskList = function() {
    var uri = 'method=list&_sid=' + this.sid;
    var deferredResult = q.defer();
    requestHelper.makeRequest(this, endpoints.downloadTasks, uri).then(function(result) {
        if (!result || !result.success) { return deferredResult.reject(); }
        deferredResult.resolve(result.data);
    }.bind(this), function(error) {
        console.log(error);
        deferredResult.reject();
    });
    return deferredResult.promise;
};

module.exports = Server;