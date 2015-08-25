'use strict';
var synology = require('./synology');
var server = synology.getServer('68.39.81.154', '5000');
server.updateEndpoints().then(function() {
    server.authenticate('admin', 'admin').then(function() {
        server.getTaskList().then(function(result) {
            console.log(result);
        });
    });
});
