'use strict';
var q = require('q');
var FS = require('q-io/fs');
var _ = require('underscore');
var endpoints = require('./endPoints');
var requestHelper = require('./requestHelper');

function Server(host, port) {
    this.host = host;
    this.port = port || '5000';
    this.sid = null;
}

Server.prototype.updateEndpoints = function () {
    var uri = 'method=query&query=';
    var map = {};
    _.each(endpoints, function (endpoint) {
        uri += endpoint.name + ',';
        map[endpoint.name] = endpoint;
    });
    return requestHelper.makeRequest(this, endpoints.info, uri).then(function (result) {
        _.each(result.data, function (data, name) {
            map[name].update(data);
        });
    });
};

Server.prototype.authenticate = function (username, password) {
    var uri = 'method=login&account=' + username + '&passwd=' + password;
    uri += '&session=DownloadStation&format=sid';
    return requestHelper.makeRequest(this, endpoints.auth, uri).then(function (result) {
        this.sid = result.data.sid;
    }.bind(this));
};

Server.prototype.logout = function () {
    var uri = 'method=logout&_sid=' + this.sid;
    uri += '&session=DownloadStation';
    return requestHelper.makeRequest(this, endpoints.auth, uri).then(function () {
        this.sid = null;
    }.bind(this));
};

Server.prototype.getTaskList = function (full) {
    var uri = 'method=list&_sid=' + this.sid;
    if (full) {
        uri += '&additional=detail,transfer,file,tracker,peer';
    }
    return requestHelper.makeRequest(this, endpoints.downloadTasks, uri).then(function (result) {
        return result.data;
    });
};

Server.prototype.getTaskDetails = function (taskId) {
    var uri = 'method=getinfo&_sid=' + this.sid;
    uri += '&additional=detail,transfer,file,tracker,peer&id=' + taskId;
    return requestHelper.makeRequest(this, endpoints.downloadTasks, uri).then(function (result) {
        return result.data;
    });
};

function getIdParameter(items) {
     var ids = '';
    for (var item of items) {
        if (!item.id) { continue; }
        if (ids) {
            ids += ',';
        }

        ids += item.id;
    }
    
    if (ids) {
        ids = '&id=' + ids;
    }
    
    return ids;
}

Server.prototype.deleteTasks = function (tasks) {
    var uri = 'method=delete&force_complete=false&_sid=' + this.sid;
    uri += getIdParameter(tasks);
    return requestHelper.makeRequest(this, endpoints.downloadTasks, uri);
};

Server.prototype.downloadTorrent = function (task, path) {
    var server = this;
    var uri = 'method=download&_sid=' + server.sid;
    uri += '&additional=detail,transfer,file,tracker,peer&task_id=' + task.id;
    return FS.makeTree(path).then(function () {
        return requestHelper.makeRawRequest(server, endpoints.downloadTasksSource, uri).then(function (response) {
            return response.body.read().then(function (result) {
                var filePath = FS.join(path, task.additional.detail.uri);
                return FS.write(filePath, result).then(function () {
                    return filePath;
                });
            });
        });
    });
};

module.exports = Server;