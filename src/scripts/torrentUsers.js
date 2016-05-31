'use strict';

var scriptHelper = require('./scriptHelper');

var users = {};
var server = null;

scriptHelper.setupServer().then(function(result) {
    server = result;
}).then(function () {
    return server.getTaskList();
}).then(function (result) {
    for (var task of result.tasks) {
        users[task.username] = users[task.username] ? users[task.username] + 1 : 1;
    }
    
    console.log(JSON.stringify(users));
}).catch(function (error) {
    console.log(error);
}).finally(function () {
    if (server.sid) {
        server.logout();
    }
});