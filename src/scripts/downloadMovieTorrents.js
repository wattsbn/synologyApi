'use strict';
var q = require('q');
var scriptHelper = require('./scriptHelper');

var server = null;

scriptHelper.setupServer().then(function (result) {
    server = result;
}).then(function () {
    return server.getTaskList(true);
}).then(function (result) {
    let tasks = [];
    let count = 0;
    
    for (let task of result.tasks) {
        if (task.username !== 'admin') { continue; }
        if (task.additional.detail.destination === 'Movies') {
            if (count >= 200 && count < 250) {
                server.downloadTorrent(task, 'temp').catch(function(error) {
                    console.log(error);
                });
            }
            count += 1;
            if (task.status !== 'paused') {
                server.pauseTasks([task]).catch(function(error) {
                    console.log(error);
                });
            }
        }
        
        tasks.push(task);
    }
    console.log(count);
    // return server.pauseTasks(tasks)
}).then(function () {
    console.log('Downloaded and paused all admin movies');
}).catch(function (error) {
    console.log(error);
}).finally(function () {
    // if (server.sid) {
    //     server.logout();
    // }
});