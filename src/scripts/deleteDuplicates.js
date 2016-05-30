'use strict';

var scriptHelper = require('./scriptHelper');

var server = null;

scriptHelper.setupServer().then(function(result) {
    server = result;
}).then(function () {
    return server.getTaskList();
}).then(function (result) {
    var tasks = [];
    for (var task of result.tasks) {
        if (task.status_extra && task.status_extra.error_detail === 'torrent_duplicate') {
            tasks.push(task);
        }
    }
    return server.deleteTasks(tasks);
}).catch(function (error) {
    console.log(error);
}).finally(function () {
    if (server.sid) {
        server.logout();
    }
});