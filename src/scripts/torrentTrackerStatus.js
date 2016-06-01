'use strict';
var q = require('q');
var scriptHelper = require('./scriptHelper');

var server = null;
var status = {};

scriptHelper.setupServer().then(function (result) {
    server = result;
}).then(function (result) {
    return server.getTaskList(true);
}).then(function (result) {
    for (let task of result.tasks) {
        let tracker = task.additional.tracker.length ? task.additional.tracker[0] : {}; 
        status[tracker.status] = status[tracker.status] ? status[tracker.status] + 1 : 1;
    }
}).then(function () {
    console.log(JSON.stringify(status));
}).catch(function (error) {
    console.log(error);
}).finally(function () {
    if (server.sid) {
        server.logout();
    }
});