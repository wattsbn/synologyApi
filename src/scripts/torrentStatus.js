'use strict';

var scriptHelper = require('./scriptHelper');

var status = {};
var server = null;

scriptHelper.setupServer().then(function(result) {
    server = result;
}).then(function () {
    return server.getTaskList();
}).then(function (result) {
    for (var basicTask of result.tasks) {
        var key = (basicTask.status_extra && basicTask.status_extra.error_detail) || basicTask.status;
        if (key) {
            status[key] = status[key] ? status[key] + 1 : 1;
        }
    }
    
    console.log(JSON.stringify(status));
}).catch(function (error) {
    console.log(error);
}).finally(function () {
    if (server.sid) {
        server.logout();
    }
});