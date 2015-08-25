'use strict';

var ApiInformation = require('./ApiEndpoint');

module.exports = {
    auth: new ApiInformation('SYNO.API.Auth'),
    downloadTasks: new ApiInformation('SYNO.DownloadStation.Task'),
    info: new ApiInformation('SYNO.API.Info').update({path: 'query.cgi'})
};