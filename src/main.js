'use strict';
var synology = require('./synology');
var server = synology.getServer('example.com', '5000');

server.updateEndpoints().then(function() {
    return server.authenticate('admin', 'admin');
}).then(function() {
    return server.getTaskList();
}).then(function(result) {
    var task = result.tasks[1];
    return server.getTaskDetails(task.id);
}).then(function(result) {
    console.log(result.tasks[0]);
    console.log(result.tasks[0].additional);
}).catch(function(error) {
    console.log(error);
}).finally(function() {
    if (server.sid) {
        server.logout();
    }
});