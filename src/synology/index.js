'use strict';
var Server = require('./Server');

var synology = {
    getServer: function(host, port) {
        return new Server(host, port);
    }
};

module.exports = synology;