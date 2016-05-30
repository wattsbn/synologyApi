'use strict';

var FS = require('q-io/fs');
var synology = require('../synology');

var getConfig = FS.read('src/scripts/config.json').then(function (content) {
    return JSON.parse(content);
});

function ScriptHelper() { }

ScriptHelper.prototype.setupServer = function () {
    return getConfig.then(function (config) {
        var server = synology.getServer(config.server.address, config.server.port);
        return server.updateEndpoints().then(function () {
            return server.authenticate(config.auth.userName, config.auth.password);
        }).then(function () {
            return server;
        });
    });
};

module.exports = new ScriptHelper();