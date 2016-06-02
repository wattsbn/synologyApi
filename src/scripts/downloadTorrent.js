'use strict';
var scriptHelper = require('./scriptHelper');

var server = null;

scriptHelper.setupServer().then(function (result) {
    server = result;
}).then(function () {
    return server.getTaskList();
}).then(function (result) {
    var task = result.tasks[0];
    return server.getTaskDetails([task]);
}).then(function (result) {
    var task = result.tasks[0];
    return server.downloadTorrent(task, 'temp');
}).then(function (filePath) {
    console.log('downloaded:', filePath);
}).catch(function (error) {
    console.log(error);
}).finally(function () {
    if (server.sid) {
        server.logout();
    }
});