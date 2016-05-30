'use strict';

var ApiInformation = require('./ApiEndpoint');

module.exports = {
    auth: new ApiInformation('SYNO.API.Auth'),
    downloadTasks: new ApiInformation('SYNO.DownloadStation.Task'),
    downloadTasksSource: new ApiInformation('SYNO.DownloadStation2.Task.Source'),
    info: new ApiInformation('SYNO.API.Info').update({path: 'query.cgi'})
};
